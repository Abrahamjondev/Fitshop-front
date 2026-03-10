// @ts-nocheck
import React, { Component } from "react";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: "Ford",
            model: "Mustang",
            color: "red",
            year: 1964,
        };
    }

    changeDetail = () => {
        this.setState({
            color: "blue",
            brand: "Tesla",
            model: "Model S",
            year: 2023,
        });
    };

    conponentDidMount() {
        console.log("Component did mount");
        //runs after the first render => retrieve data from backend server
        // Komponent DOM ga birinchi marta qo'shilgandan keyin bir marta chaqiriladi.
        // => API dan ma'lumot olish
        // => Event listeners o'rnatish
        // => Timers boshlash

    }

    componentWillUnmount() {
        console.log("Component will unmount");
        //runs when the component is removed from the DOM => clean up
        //runs before componentDidMount() => runs before the first render => clean up before the first render

        //         Komponent DOM dan ochirilishidan OLDIN chaqiriladi.
        // => Event listeners o'chirish
        // => Timers va intervallarni bekor qilish
        // => API so'rovlarini bekor qilish
        // => Xotiradan tozalash (cleanup)
    };

    componentDidUpdate() {
        console.log("Component did update");
        //      Komponent render bo'lgandan keyin chaqiriladi.
        // => Props yoki state o'zgarganida har safar chaqiriladi
        // => API dan ma'lumot olish (EHTIYOT: infinite loop xavfi!)
        // => DOM manipulyatsiya qilish
        // => Conditional check bilan ishlatish kerak:

        // if (prevProps.id !== this.props.id) {
        /*faqat id o'zgarganda bajariladi*/
        // }
    }

    render() {
        return (
            <div>
                <h1>My {this.state.brand}</h1>
                <p>
                    Color: {this.state.color} - Model: {this.state.model} from{" "}
                    {this.state.year}.
                </p>
                <button type="button" onClick={this.changeDetail}>
                    Change Detail
                </button>
            </div>
        );
    }
}

export default Test;