import React, { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const ThemeContext = createContext();

const ThemeProviderWrapper = ({ children }) => {
    const [mode, setMode] = useState("dark");

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
    };

    // Define the theme dynamically based on the mode
    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode, // This will automatically switch between 'light' and 'dark' modes
                primary: {
                    main: "#1976d2", // Main color for primary buttons or headers
                },
                secondary: {
                    main: "#ff4081", // Secondary color for secondary buttons or accents
                },
                success: {
                    main: "#4caf50", // Success button color
                },
                error: {
                    main: "#f44336", // Error button color
                },
                info: {
                    main: "#29b6f6", // Info color
                },
                background: {
                    default: mode === "light" ? "#fafafa" : "#303030", // Light vs Dark mode background
                    paper: mode === "light" ? "#ffffff" : "#424242", // Paper background for cards, dialogs, etc.
                },
                text: {
                    primary: mode === "light" ? "#212121" : "#e0e0e0", // Light vs Dark mode text
                    secondary: mode === "light" ? "#757575" : "#bdbdbd", // Secondary text for dark mode
                },
            },
            components: {
                // Custom styling for specific components
                MuiCard: {
                    styleOverrides: {
                        root: {
                            backgroundColor: mode === "light" ? "#ffffff" : "#424242", // Main card background for light/dark
                            borderRadius: "10px", // Rounded corners for cards
                            boxShadow: mode === "light" ? "0px 4px 20px rgba(0, 0, 0, 0.1)" : "none", // Light vs Dark card shadow
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: "5px", // Rounded corners for buttons
                        },
                    },
                },
                MuiDialog: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: mode === "light" ? "#f5f5f5" : "#333333", // Popup background color for light/dark
                        },
                    },
                },
                MuiTypography: {
                    styleOverrides: {
                        root: ({ theme }) => ({
                            fontFamily: "'Roboto', sans-serif",
                            color: theme.palette.text.primary, // Correct way to access theme inside styleOverrides
                        }),
                    },
                },
                MuiFormHelperText: {
                    styleOverrides: {
                        root: {
                            fontSize: "1rem",
                            margin: 0
                        },
                    },
                }
            },

        });
    }, [mode]); // Recalculate theme when mode changes

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProviderWrapper;
