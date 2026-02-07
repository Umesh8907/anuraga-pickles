import MainLayout from '@/components/layout/MainLayout'

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <MainLayout>{children}</MainLayout>
}
