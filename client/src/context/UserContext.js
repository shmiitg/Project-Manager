import React, { useState, createContext } from "react";

export const UserContext = createContext();

const UserProvider = (props) => {
    const [loggedUser, setLoggedUser] = useState(null);
    return (
        <UserContext.Provider
            value={{
                loggedUser,
                setLoggedUser,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export default UserProvider;
