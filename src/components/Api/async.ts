export class PromiseManager<T = unknown> {
  private promiseMap: Map<number, Promise<T>> = new Map();
  private resolveMap: Map<number, (value: T) => void> = new Map();
  private rejectMap: Map<number, (reason?: any) => void> = new Map();
  private cleanUpMap: Map<number, ()=>void> = new Map();

  add(addr: number,func:(res:(value: T) => void,rej:(reason?: any) => void)=>(()=>void)): Promise<T> {
    if (this.promiseMap.has(addr)) {
      // 如果已经存在，可以返回已有的或者抛出错误
      return this.promiseMap.get(addr)!;
    }
    let resolve: (value: T) => void;
    let reject: (reason?: any) => void;
    let cleanup:()=>void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
        cleanup = func(res,rej);
    });
    this.promiseMap.set(addr, promise);
    this.resolveMap.set(addr, resolve!);
    this.rejectMap.set(addr, reject!);
    this.cleanUpMap.set(addr,cleanup);
    return promise;
  }

  complete(addr: number, value: T): void {
    const resolve = this.resolveMap.get(addr);
    const cleanup = this.cleanUpMap.get(addr);
    if (resolve) {
        resolve(value);
    }
    if(cleanup)
        cleanup();
    this.cleanup(addr);
  }

  fail(addr: number, reason?: any): void {
    const reject = this.rejectMap.get(addr);
    const cleanup = this.cleanUpMap.get(addr);
    if (reject) {
        reject(reason);
    }
    if(cleanup)
        cleanup();
    this.cleanup(addr);
  }

  private cleanup(addr: number): void {
    this.promiseMap.delete(addr);
    this.resolveMap.delete(addr);
    this.rejectMap.delete(addr);
    this.cleanUpMap.delete(addr);
  }

  cleanAll(){
    this.promiseMap.forEach((item,key) => {
        const cleanup = this.cleanUpMap.get(key);
        if(cleanup)
            cleanup();
    });
    this.promiseMap.clear();
    this.resolveMap.clear();
    this.rejectMap.clear();
    this.cleanUpMap.clear();
  }

  getPromise(addr: number): Promise<T> | undefined {
    return this.promiseMap.get(addr);
  }

  // 获取所有promise
  getAllPromises(): Promise<T>[] {
    return Array.from(this.promiseMap.values());
  }

  // 用Promise.all等待所有
  async waitAll(): Promise<T[]> {
    return Promise.all(this.getAllPromises());
  }

  // 使用Promise.race处理超时：等待第一个完成的或超时
  async waitWithTimeout(timeoutMs: number): Promise<T> {
    const promises = this.getAllPromises();
    if (promises.length === 0) {
      throw new Error('No promises to wait for');
    }
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    );
    // race所有promise与超时promise
    return Promise.race([...promises, timeoutPromise]);
  }
}