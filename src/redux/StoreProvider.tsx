"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <PersistGate loading={<p>Loading</p>} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
