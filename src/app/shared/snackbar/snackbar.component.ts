import { Component, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import {bounceInDownAnimation, bounceOutUpAnimation} from "angular-animations";
import {NgClass, NgStyle} from "@angular/common";
import {SnackbarType} from "./snackbar-type";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-snackbar',
    standalone: true,
    animations: [
        trigger('moveDiv', [
            state('initial', style({ top: '-200px' })),
            state('final', style({ top: '20px' })),
            transition('initial => final', [
                animate('0.7s ease')
            ]),
            transition('final => initial', [
                animate('0.7s ease')
            ]),
        ]),
    ],
    templateUrl: './snackbar.component.html',
    imports: [
        NgStyle,
        NgClass
    ],
    styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {
    @Input() message: string;
    @Input() type: SnackbarType;


    constructor(public el: ElementRef, private renderer: Renderer2) {}

    animationState = 'initial';

    ngOnInit() {

        setTimeout(() => {
            this.animationState = 'final';
        }, 1);

        setTimeout(() => {
            this.animationState = 'initial';
        }, 3000);

        setTimeout(() => {
            this.closeSnackbar();
        }, 4000);
    }

    closeSnackbar() {
        this.renderer.removeChild(document.body, this.el.nativeElement);
    }
}
