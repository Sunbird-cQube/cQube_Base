/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentRef, ElementRef, EmbeddedViewRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { BasePortalOutlet, ComponentPortal, CdkPortalOutlet, TemplatePortal, DomPortal } from '@angular/cdk/portal';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { MatDialogConfig } from './dialog-config';
/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
import * as ɵngcc0 from '@angular/core';
export declare function throwMatDialogContentAlreadyAttachedError(): void;
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
export declare class MatDialogContainer extends BasePortalOutlet {
    private _elementRef;
    private _focusTrapFactory;
    private _changeDetectorRef;
    /** The dialog configuration. */
    _config: MatDialogConfig;
    private _document;
    /** The portal outlet inside of this container into which the dialog content will be loaded. */
    _portalOutlet: CdkPortalOutlet;
    /** The class that traps and manages focus within the dialog. */
    private _focusTrap;
    /** Element that was focused before the dialog was opened. Save this to restore upon close. */
    private _elementFocusedBeforeDialogWasOpened;
    /** State of the dialog animation. */
    _state: 'void' | 'enter' | 'exit';
    /** Emits when an animation state changes. */
    _animationStateChanged: EventEmitter<AnimationEvent>;
    /** ID of the element that should be considered as the dialog's label. */
    _ariaLabelledBy: string | null;
    /** ID for the container DOM element. */
    _id: string;
    constructor(_elementRef: ElementRef, _focusTrapFactory: FocusTrapFactory, _changeDetectorRef: ChangeDetectorRef, _document: any, 
    /** The dialog configuration. */
    _config: MatDialogConfig);
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C>;
    /**
     * Attaches a DOM portal to the dialog container.
     * @param portal Portal to be attached.
     * @deprecated To be turned into a method.
     * @breaking-change 10.0.0
     */
    attachDomPortal: (portal: DomPortal<HTMLElement>) => void;
    /** Moves focus back into the dialog if it was moved out. */
    _recaptureFocus(): void;
    /** Moves the focus inside the focus trap. */
    private _trapFocus;
    /** Restores focus to the element that was focused before the dialog opened. */
    private _restoreFocus;
    /**
     * Sets up the focus trand and saves a reference to the
     * element that was focused before the dialog was opened.
     */
    private _setupFocusTrap;
    /** Returns whether focus is inside the dialog. */
    private _containsFocus;
    /** Callback, invoked whenever an animation on the host completes. */
    _onAnimationDone(event: AnimationEvent): void;
    /** Callback, invoked when an animation on the host starts. */
    _onAnimationStart(event: AnimationEvent): void;
    /** Starts the dialog exit animation. */
    _startExitAnimation(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MatDialogContainer, [null, null, null, { optional: true; }, null]>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MatDialogContainer, "mat-dialog-container", never, {}, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5kLnRzIiwic291cmNlcyI6WyJkaWFsb2ctY29udGFpbmVyLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBDb21wb25lbnRSZWYsIEVsZW1lbnRSZWYsIEVtYmVkZGVkVmlld1JlZiwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IEJhc2VQb3J0YWxPdXRsZXQsIENvbXBvbmVudFBvcnRhbCwgQ2RrUG9ydGFsT3V0bGV0LCBUZW1wbGF0ZVBvcnRhbCwgRG9tUG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBGb2N1c1RyYXBGYWN0b3J5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgTWF0RGlhbG9nQ29uZmlnIH0gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBmb3IgdGhlIGNhc2Ugd2hlbiBhIENvbXBvbmVudFBvcnRhbCBpc1xuICogYXR0YWNoZWQgdG8gYSBEb21Qb3J0YWxPdXRsZXQgd2l0aG91dCBhbiBvcmlnaW4uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBkZWNsYXJlIGZ1bmN0aW9uIHRocm93TWF0RGlhbG9nQ29udGVudEFscmVhZHlBdHRhY2hlZEVycm9yKCk6IHZvaWQ7XG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgZGlhbG9nIGNvbnRlbnQuXG4gKiBBbmltYXRpb24gaXMgYmFzZWQgb24gaHR0cHM6Ly9tYXRlcmlhbC5pby9ndWlkZWxpbmVzL21vdGlvbi9jaG9yZW9ncmFwaHkuaHRtbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWF0RGlhbG9nQ29udGFpbmVyIGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldCB7XG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjtcbiAgICBwcml2YXRlIF9mb2N1c1RyYXBGYWN0b3J5O1xuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmO1xuICAgIC8qKiBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uICovXG4gICAgX2NvbmZpZzogTWF0RGlhbG9nQ29uZmlnO1xuICAgIHByaXZhdGUgX2RvY3VtZW50O1xuICAgIC8qKiBUaGUgcG9ydGFsIG91dGxldCBpbnNpZGUgb2YgdGhpcyBjb250YWluZXIgaW50byB3aGljaCB0aGUgZGlhbG9nIGNvbnRlbnQgd2lsbCBiZSBsb2FkZWQuICovXG4gICAgX3BvcnRhbE91dGxldDogQ2RrUG9ydGFsT3V0bGV0O1xuICAgIC8qKiBUaGUgY2xhc3MgdGhhdCB0cmFwcyBhbmQgbWFuYWdlcyBmb2N1cyB3aXRoaW4gdGhlIGRpYWxvZy4gKi9cbiAgICBwcml2YXRlIF9mb2N1c1RyYXA7XG4gICAgLyoqIEVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRpYWxvZyB3YXMgb3BlbmVkLiBTYXZlIHRoaXMgdG8gcmVzdG9yZSB1cG9uIGNsb3NlLiAqL1xuICAgIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkO1xuICAgIC8qKiBTdGF0ZSBvZiB0aGUgZGlhbG9nIGFuaW1hdGlvbi4gKi9cbiAgICBfc3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgfCAnZXhpdCc7XG4gICAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIHN0YXRlIGNoYW5nZXMuICovXG4gICAgX2FuaW1hdGlvblN0YXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPEFuaW1hdGlvbkV2ZW50PjtcbiAgICAvKiogSUQgb2YgdGhlIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyB0aGUgZGlhbG9nJ3MgbGFiZWwuICovXG4gICAgX2FyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsO1xuICAgIC8qKiBJRCBmb3IgdGhlIGNvbnRhaW5lciBET00gZWxlbWVudC4gKi9cbiAgICBfaWQ6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgX2ZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsIF9kb2N1bWVudDogYW55LCBcbiAgICAvKiogVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLiAqL1xuICAgIF9jb25maWc6IE1hdERpYWxvZ0NvbmZpZyk7XG4gICAgLyoqXG4gICAgICogQXR0YWNoIGEgQ29tcG9uZW50UG9ydGFsIGFzIGNvbnRlbnQgdG8gdGhpcyBkaWFsb2cgY29udGFpbmVyLlxuICAgICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICAgKi9cbiAgICBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD47XG4gICAgLyoqXG4gICAgICogQXR0YWNoIGEgVGVtcGxhdGVQb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGRpYWxvZyBjb250YWluZXIuXG4gICAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgICAqL1xuICAgIGF0dGFjaFRlbXBsYXRlUG9ydGFsPEM+KHBvcnRhbDogVGVtcGxhdGVQb3J0YWw8Qz4pOiBFbWJlZGRlZFZpZXdSZWY8Qz47XG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgYSBET00gcG9ydGFsIHRvIHRoZSBkaWFsb2cgY29udGFpbmVyLlxuICAgICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkLlxuICAgICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgbWV0aG9kLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAgICovXG4gICAgYXR0YWNoRG9tUG9ydGFsOiAocG9ydGFsOiBEb21Qb3J0YWw8SFRNTEVsZW1lbnQ+KSA9PiB2b2lkO1xuICAgIC8qKiBNb3ZlcyBmb2N1cyBiYWNrIGludG8gdGhlIGRpYWxvZyBpZiBpdCB3YXMgbW92ZWQgb3V0LiAqL1xuICAgIF9yZWNhcHR1cmVGb2N1cygpOiB2b2lkO1xuICAgIC8qKiBNb3ZlcyB0aGUgZm9jdXMgaW5zaWRlIHRoZSBmb2N1cyB0cmFwLiAqL1xuICAgIHByaXZhdGUgX3RyYXBGb2N1cztcbiAgICAvKiogUmVzdG9yZXMgZm9jdXMgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRpYWxvZyBvcGVuZWQuICovXG4gICAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzO1xuICAgIC8qKlxuICAgICAqIFNldHMgdXAgdGhlIGZvY3VzIHRyYW5kIGFuZCBzYXZlcyBhIHJlZmVyZW5jZSB0byB0aGVcbiAgICAgKiBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkaWFsb2cgd2FzIG9wZW5lZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9zZXR1cEZvY3VzVHJhcDtcbiAgICAvKiogUmV0dXJucyB3aGV0aGVyIGZvY3VzIGlzIGluc2lkZSB0aGUgZGlhbG9nLiAqL1xuICAgIHByaXZhdGUgX2NvbnRhaW5zRm9jdXM7XG4gICAgLyoqIENhbGxiYWNrLCBpbnZva2VkIHdoZW5ldmVyIGFuIGFuaW1hdGlvbiBvbiB0aGUgaG9zdCBjb21wbGV0ZXMuICovXG4gICAgX29uQW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpOiB2b2lkO1xuICAgIC8qKiBDYWxsYmFjaywgaW52b2tlZCB3aGVuIGFuIGFuaW1hdGlvbiBvbiB0aGUgaG9zdCBzdGFydHMuICovXG4gICAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KTogdm9pZDtcbiAgICAvKiogU3RhcnRzIHRoZSBkaWFsb2cgZXhpdCBhbmltYXRpb24uICovXG4gICAgX3N0YXJ0RXhpdEFuaW1hdGlvbigpOiB2b2lkO1xufVxuIl19