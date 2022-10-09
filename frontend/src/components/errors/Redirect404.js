import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";

function Redirect404() {
    let history = useHistory();
    useEffect(() => {
        
        history.replace("/error/404");
    }, []);
}
export default Redirect404;
