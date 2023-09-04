import Footer from "../components/footer"
import Navabr from "../components/navbar"



function about(props) {
    return (
        <>
        
        <div className=" bg-base-100 w-screen h-screen">
        <Navabr title="about" />
        <h1>This is about page</h1>
        <Footer />
        </div>
        </>
    )
}



export default about