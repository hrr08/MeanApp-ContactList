import { MeanWebappContactlistPage } from './app.po';

describe('mean-webapp-contactlist App', function() {
  let page: MeanWebappContactlistPage;

  beforeEach(() => {
    page = new MeanWebappContactlistPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
