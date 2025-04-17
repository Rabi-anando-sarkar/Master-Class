declare global {

    type Status = "pending" | "in-progress" | "completed";

    interface ICreate {
        title: string;
        description: string;
        status?: Status;
    }
    
    interface IRead {
        status?: Status;
        page?: string;
        limit?: string;
    }

    interface IUpdate {
        status?: Status
    }

    interface TokenResponse {
        accessToken: string;
        refreshToken: string;
    }
    
    interface IRegister {
        username: string;
        email: string;
        password: string;
    }
    
    interface ISignIn {
        username: string;
        email: string;
        password: string;
    }
}

export {}