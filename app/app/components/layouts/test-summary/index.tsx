import { Card, Heading } from "~/components";
import { PlaywrightDashboardSummaryReport } from "~/utils/test-helper/reporter";

export default function TestSummary({
  total,
  failed,
  passed,
}: PlaywrightDashboardSummaryReport) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-9 xl:grid-cols-9 gap-4">
      <Card className="col-span-3 flex flex-col justify-center">
        <Heading size="h1" className="text-primary text-center">
          {total}
        </Heading>
        <Heading size="h6" className="text-primary text-center">
          Total Tests
        </Heading>
      </Card>
      <Card className="col-span-3 flex flex-col justify-center">
        <Heading size="h1" className="text-success text-center">
          {passed}
        </Heading>
        <Heading size="h6" className="text-success text-center">
          Successfull Tests
        </Heading>
      </Card>
      <Card className="col-span-3 flex flex-col justify-center">
        <Heading size="h1" className="text-error text-center">
          {failed}
        </Heading>
        <Heading size="h6" className="text-error text-center">
          Failed Tests
        </Heading>
      </Card>
    </div>
  );
}
