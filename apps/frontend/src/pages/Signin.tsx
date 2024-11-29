import { Auth } from "../components/Signup/Auth"
import { Quote } from "../components/Signup/Quote"

export const Signin = () => {
    return <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
            <Auth type="signin"/>
        </div>
        <div className="hidden lg:block">
            <Quote />
        </div>
    </div>
}