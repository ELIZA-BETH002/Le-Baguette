import React from "react";
import { showConnect } from "@stacks/connect";
import { userSession } from "../utils/auth";

const WalletConnect = () => {
    const authenticate = () => {
        showConnect({
            appDetails: {
                name: "Le Baguette",
                icon: window.location.origin + "/vite.svg",
            },
            redirectTo: "/",
            onFinish: () => {
                window.location.reload();
            },
            userSession,
        });
    };

    if (userSession.isUserSignedIn()) {
        return (
            <button onClick={() => {
                userSession.signUserOut();
                window.location.reload();
            }}>
                Disconnect
            </button>
        );
    }

    return (
        <button onClick={authenticate}>
            Connect Wallet
        </button>
    );
};

export default WalletConnect;
