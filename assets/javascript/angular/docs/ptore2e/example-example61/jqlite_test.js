describe("module:ng.provider:$interpolateProvider", function() {
  beforeEach(function() {
    browser.get("./examples/example-example61/index.html");
  });

it('should interpolate binding with custom symbols', function() {
  expect(element(by.binding('demo.label')).getText()).toBe('This binding is brought you by // interpolation symbols.');
});
});