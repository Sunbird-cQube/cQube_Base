/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { DoCheck, ElementRef, NgZone, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanUpdateErrorState, CanUpdateErrorStateCtor, ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
/** @docs-private */
import * as ɵngcc0 from '@angular/core';
declare class MatInputBase {
    _defaultErrorStateMatcher: ErrorStateMatcher;
    _parentForm: NgForm;
    _parentFormGroup: FormGroupDirective;
    /** @docs-private */
    ngControl: NgControl;
    constructor(_defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, 
    /** @docs-private */
    ngControl: NgControl);
}
declare const _MatInputMixinBase: CanUpdateErrorStateCtor & typeof MatInputBase;
/** Directive that allows a native input to work inside a `MatFormField`. */
export declare class MatInput extends _MatInputMixinBase implements MatFormFieldControl<any>, OnChanges, OnDestroy, OnInit, DoCheck, CanUpdateErrorState {
    protected _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    protected _platform: Platform;
    /** @docs-private */
    ngControl: NgControl;
    private _autofillMonitor;
    protected _uid: string;
    protected _previousNativeValue: any;
    private _inputValueAccessor;
    /** The aria-describedby attribute on the input for improved a11y. */
    _ariaDescribedby: string;
    /** Whether the component is being rendered on the server. */
    readonly _isServer: boolean;
    /** Whether the component is a native html select. */
    readonly _isNativeSelect: boolean;
    /** Whether the component is a textarea. */
    readonly _isTextarea: boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    focused: boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    readonly stateChanges: Subject<void>;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    controlType: string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    autofilled: boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    protected _disabled: boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get id(): string;
    set id(value: string);
    protected _id: string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    placeholder: string;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get required(): boolean;
    set required(value: boolean);
    protected _required: boolean;
    /** Input type of the element. */
    get type(): string;
    set type(value: string);
    protected _type: string;
    /** An object used to control when error messages are shown. */
    errorStateMatcher: ErrorStateMatcher;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get value(): string;
    set value(value: string);
    /** Whether the element is readonly. */
    get readonly(): boolean;
    set readonly(value: boolean);
    private _readonly;
    protected _neverEmptyInputTypes: string[];
    constructor(_elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, _platform: Platform, 
    /** @docs-private */
    ngControl: NgControl, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _defaultErrorStateMatcher: ErrorStateMatcher, inputValueAccessor: any, _autofillMonitor: AutofillMonitor, ngZone: NgZone);
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngDoCheck(): void;
    /** Focuses the input. */
    focus(options?: FocusOptions): void;
    /** Callback for the cases where the focused state of the input changes. */
    _focusChanged(isFocused: boolean): void;
    _onInput(): void;
    /** Does some manual dirty checking on the native input `value` property. */
    protected _dirtyCheckNativeValue(): void;
    /** Make sure the input is a supported type. */
    protected _validateType(): void;
    /** Checks whether the input type is one of the types that are never empty. */
    protected _isNeverEmpty(): boolean;
    /** Checks whether the input is invalid based on the native validation. */
    protected _isBadInput(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get empty(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    setDescribedByIds(ids: string[]): void;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    onContainerClick(): void;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_readonly: BooleanInput;
    static ngAcceptInputType_required: BooleanInput;
    static ngAcceptInputType_value: any;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MatInput, [null, null, { optional: true; self: true; }, { optional: true; }, { optional: true; }, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MatInput, "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", ["matInput"], { "id": "id"; "disabled": "disabled"; "required": "required"; "type": "type"; "value": "value"; "readonly": "readonly"; "placeholder": "placeholder"; "errorStateMatcher": "errorStateMatcher"; }, {}, never>;
}
export {};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuZC50cyIsInNvdXJjZXMiOlsiaW5wdXQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgQm9vbGVhbklucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IEF1dG9maWxsTW9uaXRvciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXh0LWZpZWxkJztcbmltcG9ydCB7IERvQ2hlY2ssIEVsZW1lbnRSZWYsIE5nWm9uZSwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0NvbnRyb2wsIE5nRm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IENhblVwZGF0ZUVycm9yU3RhdGUsIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yLCBFcnJvclN0YXRlTWF0Y2hlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmRlY2xhcmUgY2xhc3MgTWF0SW5wdXRCYXNlIHtcbiAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcbiAgICBfcGFyZW50Rm9ybTogTmdGb3JtO1xuICAgIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZTtcbiAgICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICAgIG5nQ29udHJvbDogTmdDb250cm9sO1xuICAgIGNvbnN0cnVjdG9yKF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybTogTmdGb3JtLCBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsIFxuICAgIC8qKiBAZG9jcy1wcml2YXRlICovXG4gICAgbmdDb250cm9sOiBOZ0NvbnRyb2wpO1xufVxuZGVjbGFyZSBjb25zdCBfTWF0SW5wdXRNaXhpbkJhc2U6IENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICYgdHlwZW9mIE1hdElucHV0QmFzZTtcbi8qKiBEaXJlY3RpdmUgdGhhdCBhbGxvd3MgYSBuYXRpdmUgaW5wdXQgdG8gd29yayBpbnNpZGUgYSBgTWF0Rm9ybUZpZWxkYC4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1hdElucHV0IGV4dGVuZHMgX01hdElucHV0TWl4aW5CYXNlIGltcGxlbWVudHMgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBEb0NoZWNrLCBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudD47XG4gICAgcHJvdGVjdGVkIF9wbGF0Zm9ybTogUGxhdGZvcm07XG4gICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICBuZ0NvbnRyb2w6IE5nQ29udHJvbDtcbiAgICBwcml2YXRlIF9hdXRvZmlsbE1vbml0b3I7XG4gICAgcHJvdGVjdGVkIF91aWQ6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgX3ByZXZpb3VzTmF0aXZlVmFsdWU6IGFueTtcbiAgICBwcml2YXRlIF9pbnB1dFZhbHVlQWNjZXNzb3I7XG4gICAgLyoqIFRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgaW5wdXQgZm9yIGltcHJvdmVkIGExMXkuICovXG4gICAgX2FyaWFEZXNjcmliZWRieTogc3RyaW5nO1xuICAgIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgYmVpbmcgcmVuZGVyZWQgb24gdGhlIHNlcnZlci4gKi9cbiAgICByZWFkb25seSBfaXNTZXJ2ZXI6IGJvb2xlYW47XG4gICAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBhIG5hdGl2ZSBodG1sIHNlbGVjdC4gKi9cbiAgICByZWFkb25seSBfaXNOYXRpdmVTZWxlY3Q6IGJvb2xlYW47XG4gICAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBhIHRleHRhcmVhLiAqL1xuICAgIHJlYWRvbmx5IF9pc1RleHRhcmVhOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgZm9jdXNlZDogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAgICogQGRvY3MtcHJpdmF0ZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHN0YXRlQ2hhbmdlczogU3ViamVjdDx2b2lkPjtcbiAgICAvKipcbiAgICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAgICogQGRvY3MtcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnRyb2xUeXBlOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgICAqIEBkb2NzLXByaXZhdGVcbiAgICAgKi9cbiAgICBhdXRvZmlsbGVkOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW47XG4gICAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKTtcbiAgICBwcm90ZWN0ZWQgX2Rpc2FibGVkOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgZ2V0IGlkKCk6IHN0cmluZztcbiAgICBzZXQgaWQodmFsdWU6IHN0cmluZyk7XG4gICAgcHJvdGVjdGVkIF9pZDogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAgICogQGRvY3MtcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldCByZXF1aXJlZCgpOiBib29sZWFuO1xuICAgIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbik7XG4gICAgcHJvdGVjdGVkIF9yZXF1aXJlZDogYm9vbGVhbjtcbiAgICAvKiogSW5wdXQgdHlwZSBvZiB0aGUgZWxlbWVudC4gKi9cbiAgICBnZXQgdHlwZSgpOiBzdHJpbmc7XG4gICAgc2V0IHR5cGUodmFsdWU6IHN0cmluZyk7XG4gICAgcHJvdGVjdGVkIF90eXBlOiBzdHJpbmc7XG4gICAgLyoqIEFuIG9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gICAgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IHN0cmluZztcbiAgICBzZXQgdmFsdWUodmFsdWU6IHN0cmluZyk7XG4gICAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgcmVhZG9ubHkuICovXG4gICAgZ2V0IHJlYWRvbmx5KCk6IGJvb2xlYW47XG4gICAgc2V0IHJlYWRvbmx5KHZhbHVlOiBib29sZWFuKTtcbiAgICBwcml2YXRlIF9yZWFkb25seTtcbiAgICBwcm90ZWN0ZWQgX25ldmVyRW1wdHlJbnB1dFR5cGVzOiBzdHJpbmdbXTtcbiAgICBjb25zdHJ1Y3RvcihfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50PiwgX3BsYXRmb3JtOiBQbGF0Zm9ybSwgXG4gICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICBuZ0NvbnRyb2w6IE5nQ29udHJvbCwgX3BhcmVudEZvcm06IE5nRm9ybSwgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLCBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlciwgaW5wdXRWYWx1ZUFjY2Vzc29yOiBhbnksIF9hdXRvZmlsbE1vbml0b3I6IEF1dG9maWxsTW9uaXRvciwgbmdab25lOiBOZ1pvbmUpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdPbkNoYW5nZXMoKTogdm9pZDtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xuICAgIG5nRG9DaGVjaygpOiB2b2lkO1xuICAgIC8qKiBGb2N1c2VzIHRoZSBpbnB1dC4gKi9cbiAgICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZDtcbiAgICAvKiogQ2FsbGJhY2sgZm9yIHRoZSBjYXNlcyB3aGVyZSB0aGUgZm9jdXNlZCBzdGF0ZSBvZiB0aGUgaW5wdXQgY2hhbmdlcy4gKi9cbiAgICBfZm9jdXNDaGFuZ2VkKGlzRm9jdXNlZDogYm9vbGVhbik6IHZvaWQ7XG4gICAgX29uSW5wdXQoKTogdm9pZDtcbiAgICAvKiogRG9lcyBzb21lIG1hbnVhbCBkaXJ0eSBjaGVja2luZyBvbiB0aGUgbmF0aXZlIGlucHV0IGB2YWx1ZWAgcHJvcGVydHkuICovXG4gICAgcHJvdGVjdGVkIF9kaXJ0eUNoZWNrTmF0aXZlVmFsdWUoKTogdm9pZDtcbiAgICAvKiogTWFrZSBzdXJlIHRoZSBpbnB1dCBpcyBhIHN1cHBvcnRlZCB0eXBlLiAqL1xuICAgIHByb3RlY3RlZCBfdmFsaWRhdGVUeXBlKCk6IHZvaWQ7XG4gICAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBpbnB1dCB0eXBlIGlzIG9uZSBvZiB0aGUgdHlwZXMgdGhhdCBhcmUgbmV2ZXIgZW1wdHkuICovXG4gICAgcHJvdGVjdGVkIF9pc05ldmVyRW1wdHkoKTogYm9vbGVhbjtcbiAgICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGlucHV0IGlzIGludmFsaWQgYmFzZWQgb24gdGhlIG5hdGl2ZSB2YWxpZGF0aW9uLiAqL1xuICAgIHByb3RlY3RlZCBfaXNCYWRJbnB1dCgpOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgZ2V0IGVtcHR5KCk6IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgICAqIEBkb2NzLXByaXZhdGVcbiAgICAgKi9cbiAgICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgICAqIEBkb2NzLXByaXZhdGVcbiAgICAgKi9cbiAgICBvbkNvbnRhaW5lckNsaWNrKCk6IHZvaWQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlYWRvbmx5OiBCb29sZWFuSW5wdXQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlcXVpcmVkOiBCb29sZWFuSW5wdXQ7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ZhbHVlOiBhbnk7XG59XG5leHBvcnQge307XG4iXX0=