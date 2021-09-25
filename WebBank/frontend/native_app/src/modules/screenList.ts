import { NewPayment } from "modules/interfaces/newPayment";

export type ScreenList = {
    LoginScreen: undefined,
    OverviewScreen: undefined,
    HistoryScreen: undefined,
    NewPaymentName: undefined,
    NewPaymentAccountNumber: { newPayment: NewPayment },
    NewPaymentAmount: { newPayment: NewPayment },
    NewPaymentPreview: { newPayment: NewPayment },
    NewPaymentConfirmation: { newPayment: NewPayment }
}