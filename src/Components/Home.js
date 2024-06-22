import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import getWeb3 from './getweb3';
import "./Home.css";

const Home = () => {
    const [contract, setContract] = useState(null);
    const [metaMaskConnected, setMetaMaskConnected] = useState(false);

    const initializeWeb3 = async () => {
        try {
            const web3 = await getWeb3();
            const contractInstance = {};
            setContract(contractInstance);
        } catch (error) {
            console.error('Error initializing web3:', error);
        }
    };

    useEffect(() => {
        initializeWeb3();
    }, []);

    const navi = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [role, setRole] = useState("");
    const [loginRes, setLoginRes] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
    };

    const isButtonSelected = (buttonRole) => {
        return buttonRole === role
            ? "select"
            : "not-select";
    };

    const navigateTo = (path) => {
        navi(path);
    };

    const handleLogin = (data) => {
        setIsLoading(true);
        try {
            if (role === 'admin') {
                if (data.password === "admin123") {
                    setLoginRes({ data: { success: true } });
                    navigateTo('/admin');
                } else {
                    setLoginRes({ data: { success: false, message: "Invalid password" } });
                }
            } else if (role === 'user') {
                if (data.password === "user123") {
                    setLoginRes({ data: { success: true } });
                    navigateTo('/user');
                } else {
                    setLoginRes({ data: { success: false, message: "Invalid password" } });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginRes({ data: { success: false, message: "An error occurred during login" } });
        } finally {
            setIsLoading(false);
            reset();
        }
    };

    return (
        <div className="d-flex justify-content-center" style={{ marginTop: '200px' }}>
            <div className="card" style={{ backgroundColor: "rgb(92, 225, 230)" }}>
                <div className="card-head">
                    <div className="row justify-content-evenly ps-2 pe-2">
                        <div className="col-auto mt-3 mb-3 m-3 p-0">
                            <button
                                className={`btn p-0 ${isButtonSelected("user")}`}
                                onClick={() => handleRoleSelection("user")}
                            >
                                User
                            </button>
                        </div>
                        <div className="col-auto mt-3 ms-2 mb-3 m-3 p-0">
                            <button
                                className={`btn p-0 ${isButtonSelected("admin")}`}
                                onClick={() => handleRoleSelection("admin")}
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="m-0" style={{ color: "rgb(103, 151, 103)" }} />
                {role === "" ? (
                    <div className="text-center mt-3 mb-3 p-2">
                        <span className="text-black" style={{ fontWeight: "600" }}>
                            Select your role
                        </span>
                    </div>
                ) : (
                    <div className="card-body">
                        {loginRes.data?.success === false && (
                            <p className="text-danger fw-bold">{loginRes.data.message}</p>
                        )}
                        <form onSubmit={handleSubmit(handleLogin)}>
                            <div className="row ms-2 me-1">
                                <div className="col-auto">
                                    <div className="mb-1">
                                        {errors.roll && (
                                            <p className="text-danger">{errors.roll.message}</p>
                                        )}
                                        <label
                                            className="form-label mt-3 text-black"
                                            style={{ fontWeight: "600" }}
                                        >
                                            {`Enter ${role} password :`}
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password should be at least 6 characters",
                                                },
                                            })}
                                        />
                                        {errors.password && (
                                            <p className="text-danger">{errors.password.message}</p>
                                        )}
                                        <div className="row justify-content-center mt-3">
                                            <div className="col-auto mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn enter"
                                                    disabled={isLoading}
                                                >
                                                    Login
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
