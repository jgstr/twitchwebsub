import sinon from "sinon";
import { createReporter } from "../subscriber/adapters/reporter";
import { expect } from "chai";
describe("Reporter", function () {
  this.timeout(30000);

  // before(function (done) {
  //   done();
  // });

  it("should return report a getAllSubscriptions event.", function (done) {
    const reporter = createReporter({}); // the configuration would replace the empty object.
    reporter.reportGetAllSubscriptions("User requested all subscriptions.");
    const spy = sinon(reporter, "reportGetAllSubscriptions");
    expect(spy.calledOnce).to.be.true;
    done();
  });
});
