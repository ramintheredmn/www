import { Hearts } from "react-loader-spinner"

function Loading() {
    return (
        <div>
            <Hearts
                height="80"
                width="80"
                color="red"
                ariaLabel="hearts-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    )
}

export default Loading