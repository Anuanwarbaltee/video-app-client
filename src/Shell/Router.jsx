import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "../DefaultLayout/Layout";
;
import { Suspense, lazy } from "react";
import Loader from "../Component/Common/Loader";

const Login = lazy(() => import("../Access/Login"))
const Signup = lazy(() => import("../Pages/SignUp"))
const Home = lazy(() => import("../Pages/Home"))
const Preview = lazy(() => import("../Pages/Preview"))
const Subscription = lazy(() => import("../Pages/Subscription"))
const WatchHistory = lazy(() => import("../Pages/WatchHistory"))
const LikedVideos = lazy(() => import("../Pages/LikedVideos"))
const ChannelVideos = lazy(() => import("../Pages/ChanalVideos"))
const UpdateVideo = lazy(() => import("../Pages/EditVideo"))
const Settings = lazy(() => import("../Pages/Settings"))


const WithLayout = ({ component }) => {
    return <DefaultLayout> {component} </DefaultLayout>
}

const Router = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loader size={50} message={"Loading..."} />}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<WithLayout component={<Home />} />} />
                    <Route path="/preview/:id" element={<WithLayout component={<Preview />} />} />
                    <Route path="/watch-history" element={<WithLayout component={<WatchHistory />} />} />
                    <Route path="/subscription" element={<WithLayout component={<Subscription />} />} />
                    <Route path="/liked-video" element={<WithLayout component={<LikedVideos />} />} />
                    <Route path="/video/:id" element={<WithLayout component={<ChannelVideos />} />} />
                    <Route path="/edit-video/:id" element={<WithLayout component={<UpdateVideo />} />} />
                    <Route path="/settings/:id" element={<WithLayout component={<Settings />} />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}
export default Router;