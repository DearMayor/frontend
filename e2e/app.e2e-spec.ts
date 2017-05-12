import { Ng2DearmayorPage } from './app.po';

describe('ng2-dearmayor App', () => {
  let page: Ng2DearmayorPage;

  beforeEach(() => {
    page = new Ng2DearmayorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
