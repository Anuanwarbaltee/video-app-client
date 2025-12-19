import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "../DefaultLayout/Layout";
;
import React, { Suspense, lazy } from "react";
import Loader from "../Component/Common/Loader";
import WatchHistory from "../Pages/WatchHistory";

const Login = lazy(() => import("../Access/Login"))
const Home = lazy(() => import("../Pages/Home"))
const Preview = lazy(() => import("../Pages/Preview"))


const WithLayout = ({ component }) => {

    return <DefaultLayout> {component} </DefaultLayout>

}

const Router = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loader size={50} message={"Loading..."} />}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<WithLayout component={<Home />} />} />
                    <Route path="/preview/:id" element={<WithLayout component={<Preview />} />} />
                    <Route path="/watch-history" element={<WithLayout component={<WatchHistory />} />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}
export default Router;