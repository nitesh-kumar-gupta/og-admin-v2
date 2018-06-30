import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

let APISwitch = (PORT_NUMBER) => {
    switch (PORT_NUMBER) {
        case 'api_2':
            return ;
        default:
            return environment.API;
    }
}

export let APIBasedServiceProvider = {
    APISwitch
}