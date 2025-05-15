import Modal, { ModalProps } from "~/components/modal";

export default function HelpDependencyModal(props: Omit<ModalProps, "title">) {
  return (
    <Modal {...props} title="Help: Dependencies">
      <div className="grid gap-4">
        <div>
          <p className="font-bold">What are dependencies?</p>
          <p className="text-sm">
            Dependencies are simply “pre-tests” you record once and then re-run
            automatically whenever you run or record a suite. By turning common
            setup flows (like logging in) into dependencies, you avoid repeating
            them in every test.
          </p>
        </div>
        <div>
          <p className="font-bold">Nested dependencies</p>
          <p className="text-sm">
            Each dependency can itself depend on other tests, forming a
            dependency tree. For example, you might have a User Login dependency
            which in turn depends on Admin Login.
          </p>
        </div>
        <div>
          <p className="font-bold">Parallel vs. Chained Execution</p>
          <p className="text-sm">
            By default, all dependencies of a suite run in parallel—they start
            at the same time. If you need a true “step 1 → step 2 → step 3”
            setup (a chained flow), give each setup test its own dependency.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-bold">Example: </p>
          <ul>
            <li>Create Admin Login</li>
            <li>Create User Login and set it to depend on Admin Login</li>
          </ul>
          <p>That way, you get:</p>
          <ul>
            <li>Reusability: record your login flow once, reuse everywhere</li>
            <li>
              Flexibility: spin up multiple setups in parallel for speed, or
              chain them for strict order
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
