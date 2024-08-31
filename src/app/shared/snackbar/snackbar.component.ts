import { Component, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import {bounceInDownAnimation, bounceOutUpAnimation} from "angular-animations";
import {NgClass, NgStyle} from "@angular/common";
import {SnackbarType} from "./snackbar-type";

@Component({
    selector: 'app-snackbar',
    standalone: true,
    animations: [
        bounceInDownAnimation(),
        bounceOutUpAnimation({ duration: 500 })
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
    appearAnimationState: boolean = false;
    disappearAnimationState: boolean = false;
    hideSnackbar: boolean = true;

    constructor(public el: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.appearAnimationState = true;
            this.hideSnackbar = false;
        }, 1);

        setTimeout(() => {
            this.disappearAnimationState = true;
        }, 3000);

        setTimeout(() => {
            this.hideSnackbar = true;
            this.closeSnackbar();
        }, 3400);

    }

    closeSnackbar() {
        this.renderer.removeChild(document.body, this.el.nativeElement);
    }
}
