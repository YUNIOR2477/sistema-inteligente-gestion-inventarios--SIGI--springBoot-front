import { Card } from "@/components/ui/card";

const TermsOfService = () => {
    return (
        <Card className="w-full max-w-4xl mx-auto shadow-xl mt-2 border border-muted bg-primary-foreground/60 p-4">
            <div className="max-w-4xl mx-auto p-6 space-y-6 text-foreground">
                <h1 className="text-3xl font-medium text-center mb-6">
                    Terms of Service
                </h1>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                    <p className="text-sm text-muted-foreground">
                        By accessing and using the <strong>SIGI</strong> — Intelligent Inventory Management System — application, you agree to comply with these Terms of Service. If you do not agree with any of them, you must refrain from using the platform.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">2. Service Description</h2>
                    <p className="text-sm text-muted-foreground">
                        SIGI is an application designed for comprehensive management of inventories, orders, movements, audits, and communication between internal and external users. Access to specific functionalities depends on the assigned role (Administrator, Warehouse Staff, Seller, Auditor, Client, Distributor).
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">3. Roles and Responsibilities</h2>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>
                            <strong>Administrator:</strong> Global configuration, user management, products, inventories, and audits.
                        </li>
                        <li>
                            <strong>Warehouse Staff:</strong> Recording inventory entries/exits, transfers, and adjustments.
                        </li>
                        <li>
                            <strong>Seller:</strong> Creation and management of orders, communication with clients.
                        </li>
                        <li>
                            <strong>Auditor:</strong> Validation of traceability, access to reports and records.
                        </li>
                        <li>
                            <strong>Client:</strong> Creation and consultation of own orders, limited access to catalog.
                        </li>
                        <li>
                            <strong>Distributor:</strong> Recording incoming shipments and consultation of receipts.
                        </li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">4. Permitted Use</h2>
                    <p className="text-sm text-muted-foreground">
                        Users agree to use the application solely for legitimate purposes related to inventory and order management. The following are prohibited:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Manipulating data for fraudulent purposes.</li>
                        <li>Accessing modules without authorization.</li>
                        <li>Sharing credentials with third parties.</li>
                        <li>Altering the security or integrity of the system.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">5. Privacy and Security</h2>
                    <p className="text-sm text-muted-foreground">
                        The application protects user information in accordance with current privacy policies. Access is performed through secure authentication, and sensitive data is handled with strict confidentiality.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
                    <p className="text-sm text-muted-foreground">
                        SIGI is not responsible for losses resulting from misuse of the platform, data entry errors by the user, or service interruptions caused by external factors.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">7. Modifications</h2>
                    <p className="text-sm text-muted-foreground">
                        We reserve the right to modify these Terms of Service at any time. Changes will be notified through the application and will take effect immediately upon publication.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">8. Contact</h2>
                    <p className="text-sm text-muted-foreground">
                        For inquiries related to these terms, you may contact the SIGI support team at{" "}
                        <a
                            href="mailto:soporte@sigi.com"
                            className="text-primary hover:underline"
                        >
                            soporte@sigi.com
                        </a>
                        .
                    </p>
                </section>
            </div>
        </Card>
    );
};

export default TermsOfService;