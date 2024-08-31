import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from "@angular/core";
import {SnackbarComponent} from "./snackbar.component";
import {SnackbarType} from "./snackbar-type";

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

    displaySnackbar(message: string, type: SnackbarType) {

        //creating snackbar (component) dynamically
        const SnackbarComponentFactory = this.componentFactoryResolver.resolveComponentFactory(SnackbarComponent);
        const SnackbarComponentRef = SnackbarComponentFactory.create(this.injector);

        //passing @Inputs to the snackbar component
        if (message) {
          SnackbarComponentRef.instance["message"] = message;
          SnackbarComponentRef.instance["type"] = type;
        }

        //attach snackbar to the DOM
        const snackbarElement = (SnackbarComponentRef.hostView as any).rootNodes[0] as HTMLElement;
        this.appRef.attachView(SnackbarComponentRef.hostView);
        document.body.appendChild(snackbarElement);

        //clean up when the snackbar is closed
        (SnackbarComponentRef.instance as any).closeSnackbar = () => {
            this.appRef.detachView(SnackbarComponentRef.hostView);
            SnackbarComponentRef.destroy();
        };
    }
}
