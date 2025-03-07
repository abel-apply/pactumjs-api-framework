import * as pactum from 'pactum';

export class TestContext {
  private static instance: TestContext;
  private currentSpec: ReturnType<typeof pactum.spec> = pactum.spec();
  private lastResponse: any = null;
  private baseUrl: string = '';

  private constructor() {}

  public static getInstance(): TestContext {
    if (!TestContext.instance) {
      TestContext.instance = new TestContext();
    }
    return TestContext.instance;
  }

  public getSpec(): ReturnType<typeof pactum.spec> {
    return this.currentSpec;
  }

  public initializeSpec(): void {
    this.currentSpec = pactum.spec();
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
    pactum.request.setBaseUrl(url);
  }

  public setLastResponse(response: any): void {
    this.lastResponse = response;
  }

  public getLastResponse(): any {
    return this.lastResponse;
  }

  public async toss(): Promise<any> {
    const response = await this.currentSpec.toss();
    this.setLastResponse(response);
    this.initializeSpec();
    return response;
  }
}
