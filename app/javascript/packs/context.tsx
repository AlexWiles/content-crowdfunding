import React, { useState, useReducer, Dispatch } from "react";

type NotificationAction = { message: string; id: string; type: "ADD_NOTIFICATION" };

export const newNotification = (message: string): NotificationAction => ({
  type: "ADD_NOTIFICATION",
  id: Math.random().toString(36).substr(2, 9),
  message,
});

type Action = NotificationAction;

type Notification = { message: string, id: string };

export type AppState = {
  notifications: {
    byId: {[key: string]: Notification}
    allIds: string[]
  };
};

export const initialAppState: AppState = {
  notifications: {byId: {}, allIds: []},
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return state;
    default:
      throw new Error();
  }
};

const intialDispatch: React.Dispatch<Action> = (value: Action) => {};

export const AppContext = React.createContext({
  state: initialAppState,
  dispatch: intialDispatch,
});

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAppState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
