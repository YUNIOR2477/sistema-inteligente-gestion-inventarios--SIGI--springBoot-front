import { Card } from "@/components/ui/card";

const PrivacyPolicy = () => {
    return (
        <Card className="w-full max-w-4xl mx-auto shadow-xl mt-2 border border-muted bg-primary-foreground/60 p-4">
            <div className="max-w-4xl mx-auto p-6 space-y-6 text-foreground">
                <h1 className="text-3xl font-medium text-center mb-6">
                    Security Policies
                </h1>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">1. Objective</h2>
                    <p className="text-sm text-muted-foreground">
                        These security policies aim to protect the information,
                        processes, and users of the <strong>SIGI</strong> —
                        Intelligent Inventory Management System — ensuring the
                        confidentiality, integrity, and availability of data.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">2. Authentication and Access Control</h2>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>System access requires unique user credentials.</li>
                        <li>Passwords must be at least 8 characters long and comply with complexity policies.</li>
                        <li>Roles (Administrator, Warehouse Staff, Seller, Auditor, Client, Distributor) determine access permissions.</li>
                        <li>Sharing credentials between users is prohibited.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">3. Data Protection</h2>
                    <p className="text-sm text-muted-foreground">
                        All information stored in SIGI is handled with strict confidentiality. Sensitive data (users, orders, inventories) is transmitted through secure protocols (HTTPS, WebSocket with authentication).
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">4. Auditing and Traceability</h2>
                    <p className="text-sm text-muted-foreground">
                        The system records all relevant operations to ensure traceability:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Inventory entries and exits.</li>
                        <li>Order creation and modification.</li>
                        <li>Stock adjustments and movements.</li>
                        <li>Access to reports and queries.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                        Auditors have read-only access to all records and can export reports for external validation.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">5. Communication Security</h2>
                    <p className="text-sm text-muted-foreground">
                        Internal messaging (user-to-user chat) is protected through secure and authenticated channels. Administrators and auditors may access communication logs for control and compliance purposes.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">6. Backup and Availability</h2>
                    <p className="text-sm text-muted-foreground">
                        SIGI implements periodic backup mechanisms and high-availability measures to minimize the impact of technical failures. In case of incidents, defined recovery plans are applied.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">7. User Responsibilities</h2>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Use the application only for authorized purposes.</li>
                        <li>Report any suspicious activity or security incident.</li>
                        <li>Keep credentials and personal data up to date.</li>
                        <li>Do not attempt to manipulate or compromise system security.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">8. Security Updates</h2>
                    <p className="text-sm text-muted-foreground">
                        These policies may be updated periodically to adapt to new threats or legal requirements. Changes will be notified through the application.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">9. Contact</h2>
                    <p className="text-sm text-muted-foreground">
                        For inquiries related to application security, you can contact the SIGI support team at{" "}
                        <a
                            href="mailto:seguridad@sigi.com"
                            className="text-primary hover:underline"
                        >
                            seguridad@sigi.com
                        </a>
                        .
                    </p>
                </section>
            </div>
        </Card>
    );
};

export default PrivacyPolicy;