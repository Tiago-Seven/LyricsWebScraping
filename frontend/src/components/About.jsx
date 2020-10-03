import React, { Component }  from "react";
import { withRouter } from 'react-router-dom'
import music from '../music.jpg'


function About() {
    return (
        <div className="about">
            <div class="container">
                <div class="row align-items-center my-5">
                    <div class="col-lg-7">
                        <img
                            class="img-fluid rounded mb-4 mb-lg-0"
                            src={music}
                        />
                    </div>
                    <div class="col-lg-5">
                        <h1 class="font-weight-light">About</h1>
                        <p>
                           This project has the objective of showing how many times each word
                           is used in, either a particular song, or a particular album, using the Genious website.
                           Graphs are displayed for people who like these kind of statistics!
            </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;