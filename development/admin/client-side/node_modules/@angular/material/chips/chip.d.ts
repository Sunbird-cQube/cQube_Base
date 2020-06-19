/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ElementRef, EventEmitter, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CanColor, CanColorCtor, CanDisableRipple, CanDisableRippleCtor, HasTabIndex, HasTabIndexCtor, RippleConfig, RippleGlobalOptions, RippleTarget } from '@angular/material/core';
import { Subject } from 'rxjs';
/** Represents an event fired on an individual `mat-chip`. */
import * as ɵngcc0 from '@angular/core';
export interface MatChipEvent {
    /** The chip the event was fired on. */
    chip: MatChip;
}
/** Event object emitted by MatChip when selected or deselected. */
export declare class MatChipSelectionChange {
    /** Reference to the chip that emitted the event. */
    source: MatChip;
    /** Whether the chip that emitted the event is selected. */
    selected: boolean;
    /** Whether the selection change was a result of a user interaction. */
    isUserInput: boolean;
    constructor(
    /** Reference to the chip that emitted the event. */
    source: MatChip, 
    /** Whether the chip that emitted the event is selected. */
    selected: boolean, 
    /** Whether the selection change was a result of a user interaction. */
    isUserInput?: boolean);
}
/** @docs-private */
declare class MatChipBase {
    _elementRef: ElementRef;
    disabled: boolean;
    constructor(_elementRef: ElementRef);
}
declare const _MatChipMixinBase: CanColorCtor & CanDisableRippleCtor & HasTabIndexCtor & typeof MatChipBase;
/**
 * Dummy directive to add CSS class to chip avatar.
 * @docs-private
 */
export declare class MatChipAvatar {
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MatChipAvatar, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MatChipAvatar, "mat-chip-avatar, [matChipAvatar]", never, {}, {}, never>;
}
/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
export declare class MatChipTrailingIcon {
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MatChipTrailingIcon, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MatChipTrailingIcon, "mat-chip-trailing-icon, [matChipTrailingIcon]", never, {}, {}, never>;
}
/**
 * Material design styled Chip component. Used inside the MatChipList component.
 */
export declare class MatChip extends _MatChipMixinBase implements FocusableOption, OnDestroy, CanColor, CanDisableRipple, RippleTarget, HasTabIndex {
    _elementRef: ElementRef<HTMLElement>;
    private _ngZone;
    private _changeDetectorRef?;
    /** Reference to the RippleRenderer for the chip. */
    private _chipRipple;
    /**
     * Reference to the element that acts as the chip's ripple target. This element is
     * dynamically added as a child node of the chip. The chip itself cannot be used as the
     * ripple target because it must be the host of the focus indicator.
     */
    private _chipRippleTarget;
    /**
     * Ripple configuration for ripples that are launched on pointer down. The ripple config
     * is set to the global ripple options since we don't have any configurable options for
     * the chip ripples.
     * @docs-private
     */
    rippleConfig: RippleConfig & RippleGlobalOptions;
    /**
     * Whether ripples are disabled on interaction
     * @docs-private
     */
    get rippleDisabled(): boolean;
    /** Whether the chip has focus. */
    _hasFocus: boolean;
    /** Whether animations for the chip are enabled. */
    _animationsDisabled: boolean;
    /** Whether the chip list is selectable */
    chipListSelectable: boolean;
    /** Whether the chip list is in multi-selection mode. */
    _chipListMultiple: boolean;
    /** Whether the chip list as a whole is disabled. */
    _chipListDisabled: boolean;
    /** The chip avatar */
    avatar: MatChipAvatar;
    /** The chip's trailing icon. */
    trailingIcon: MatChipTrailingIcon;
    /** The chip's remove toggler. */
    removeIcon: MatChipRemove;
    /** Whether the chip is selected. */
    get selected(): boolean;
    set selected(value: boolean);
    protected _selected: boolean;
    /** The value of the chip. Defaults to the content inside `<mat-chip>` tags. */
    get value(): any;
    set value(value: any);
    protected _value: any;
    /**
     * Whether or not the chip is selectable. When a chip is not selectable,
     * changes to its selected state are always ignored. By default a chip is
     * selectable, and it becomes non-selectable if its parent chip list is
     * not selectable.
     */
    get selectable(): boolean;
    set selectable(value: boolean);
    protected _selectable: boolean;
    /** Whether the chip is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    protected _disabled: boolean;
    /**
     * Determines whether or not the chip displays the remove styling and emits (removed) events.
     */
    get removable(): boolean;
    set removable(value: boolean);
    protected _removable: boolean;
    /** Emits when the chip is focused. */
    readonly _onFocus: Subject<MatChipEvent>;
    /** Emits when the chip is blured. */
    readonly _onBlur: Subject<MatChipEvent>;
    /** Emitted when the chip is selected or deselected. */
    readonly selectionChange: EventEmitter<MatChipSelectionChange>;
    /** Emitted when the chip is destroyed. */
    readonly destroyed: EventEmitter<MatChipEvent>;
    /** Emitted when a chip is to be removed. */
    readonly removed: EventEmitter<MatChipEvent>;
    /** The ARIA selected applied to the chip. */
    get ariaSelected(): string | null;
    constructor(_elementRef: ElementRef<HTMLElement>, _ngZone: NgZone, platform: Platform, globalRippleOptions: RippleGlobalOptions | null, animationMode?: string, _changeDetectorRef?: ChangeDetectorRef | undefined, tabIndex?: string, _document?: any);
    _addHostClassName(): void;
    ngOnDestroy(): void;
    /** Selects the chip. */
    select(): void;
    /** Deselects the chip. */
    deselect(): void;
    /** Select this chip and emit selected event */
    selectViaInteraction(): void;
    /** Toggles the current selected state of this chip. */
    toggleSelected(isUserInput?: boolean): boolean;
    /** Allows for programmatic focusing of the chip. */
    focus(): void;
    /**
     * Allows for programmatic removal of the chip. Called by the MatChipList when the DELETE or
     * BACKSPACE keys are pressed.
     *
     * Informs any listeners of the removal request. Does not remove the chip from the DOM.
     */
    remove(): void;
    /** Handles click events on the chip. */
    _handleClick(event: Event): void;
    /** Handle custom key presses. */
    _handleKeydown(event: KeyboardEvent): void;
    _blur(): void;
    private _dispatchSelectionChange;
    private _markForCheck;
    static ngAcceptInputType_selected: BooleanInput;
    static ngAcceptInputType_selectable: BooleanInput;
    static ngAcceptInputType_removable: BooleanInput;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_disableRipple: BooleanInput;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MatChip, [null, null, null, { optional: true; }, { optional: true; }, null, { attribute: "tabindex"; }, { optional: true; }]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MatChip, "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", ["matChip"], { "color": "color"; "disableRipple": "disableRipple"; "tabIndex": "tabIndex"; "selected": "selected"; "value": "value"; "selectable": "selectable"; "disabled": "disabled"; "removable": "removable"; }, { "selectionChange": "selectionChange"; "destroyed": "destroyed"; "removed": "removed"; }, ["avatar", "trailingIcon", "removeIcon"]>;
}
/**
 * Applies proper (click) support and adds styling for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 *     `<mat-chip>
 *       <mat-icon matChipRemove>cancel</mat-icon>
 *     </mat-chip>`
 *
 * You *may* use a custom icon, but you may need to override the `mat-chip-remove` positioning
 * styles to properly center the icon within the chip.
 */
export declare class MatChipRemove {
    protected _parentChip: MatChip;
    constructor(_parentChip: MatChip, elementRef?: ElementRef<HTMLElement>);
    /** Calls the parent chip's public `remove()` method if applicable. */
    _handleClick(event: Event): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MatChipRemove, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MatChipRemove, "[matChipRemove]", never, {}, {}, never>;
}
export {};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5kLnRzIiwic291cmNlcyI6WyJjaGlwLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgRm9jdXNhYmxlT3B0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgTmdab25lLCBPbkRlc3Ryb3ksIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLCBDYW5EaXNhYmxlUmlwcGxlLCBDYW5EaXNhYmxlUmlwcGxlQ3RvciwgSGFzVGFiSW5kZXgsIEhhc1RhYkluZGV4Q3RvciwgUmlwcGxlQ29uZmlnLCBSaXBwbGVHbG9iYWxPcHRpb25zLCBSaXBwbGVUYXJnZXQgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbi8qKiBSZXByZXNlbnRzIGFuIGV2ZW50IGZpcmVkIG9uIGFuIGluZGl2aWR1YWwgYG1hdC1jaGlwYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Q2hpcEV2ZW50IHtcbiAgICAvKiogVGhlIGNoaXAgdGhlIGV2ZW50IHdhcyBmaXJlZCBvbi4gKi9cbiAgICBjaGlwOiBNYXRDaGlwO1xufVxuLyoqIEV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IE1hdENoaXAgd2hlbiBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWF0Q2hpcFNlbGVjdGlvbkNoYW5nZSB7XG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHNvdXJjZTogTWF0Q2hpcDtcbiAgICAvKiogV2hldGhlciB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50IGlzIHNlbGVjdGVkLiAqL1xuICAgIHNlbGVjdGVkOiBib29sZWFuO1xuICAgIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3Rpb24gY2hhbmdlIHdhcyBhIHJlc3VsdCBvZiBhIHVzZXIgaW50ZXJhY3Rpb24uICovXG4gICAgaXNVc2VySW5wdXQ6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY2hpcCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHNvdXJjZTogTWF0Q2hpcCwgXG4gICAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgdGhhdCBlbWl0dGVkIHRoZSBldmVudCBpcyBzZWxlY3RlZC4gKi9cbiAgICBzZWxlY3RlZDogYm9vbGVhbiwgXG4gICAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdGlvbiBjaGFuZ2Ugd2FzIGEgcmVzdWx0IG9mIGEgdXNlciBpbnRlcmFjdGlvbi4gKi9cbiAgICBpc1VzZXJJbnB1dD86IGJvb2xlYW4pO1xufVxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmRlY2xhcmUgY2xhc3MgTWF0Q2hpcEJhc2Uge1xuICAgIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKTtcbn1cbmRlY2xhcmUgY29uc3QgX01hdENoaXBNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIENhbkRpc2FibGVSaXBwbGVDdG9yICYgSGFzVGFiSW5kZXhDdG9yICYgdHlwZW9mIE1hdENoaXBCYXNlO1xuLyoqXG4gKiBEdW1teSBkaXJlY3RpdmUgdG8gYWRkIENTUyBjbGFzcyB0byBjaGlwIGF2YXRhci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWF0Q2hpcEF2YXRhciB7XG59XG4vKipcbiAqIER1bW15IGRpcmVjdGl2ZSB0byBhZGQgQ1NTIGNsYXNzIHRvIGNoaXAgdHJhaWxpbmcgaWNvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWF0Q2hpcFRyYWlsaW5nSWNvbiB7XG59XG4vKipcbiAqIE1hdGVyaWFsIGRlc2lnbiBzdHlsZWQgQ2hpcCBjb21wb25lbnQuIFVzZWQgaW5zaWRlIHRoZSBNYXRDaGlwTGlzdCBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1hdENoaXAgZXh0ZW5kcyBfTWF0Q2hpcE1peGluQmFzZSBpbXBsZW1lbnRzIEZvY3VzYWJsZU9wdGlvbiwgT25EZXN0cm95LCBDYW5Db2xvciwgQ2FuRGlzYWJsZVJpcHBsZSwgUmlwcGxlVGFyZ2V0LCBIYXNUYWJJbmRleCB7XG4gICAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICAgIHByaXZhdGUgX25nWm9uZTtcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZj87XG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgUmlwcGxlUmVuZGVyZXIgZm9yIHRoZSBjaGlwLiAqL1xuICAgIHByaXZhdGUgX2NoaXBSaXBwbGU7XG4gICAgLyoqXG4gICAgICogUmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgYWN0cyBhcyB0aGUgY2hpcCdzIHJpcHBsZSB0YXJnZXQuIFRoaXMgZWxlbWVudCBpc1xuICAgICAqIGR5bmFtaWNhbGx5IGFkZGVkIGFzIGEgY2hpbGQgbm9kZSBvZiB0aGUgY2hpcC4gVGhlIGNoaXAgaXRzZWxmIGNhbm5vdCBiZSB1c2VkIGFzIHRoZVxuICAgICAqIHJpcHBsZSB0YXJnZXQgYmVjYXVzZSBpdCBtdXN0IGJlIHRoZSBob3N0IG9mIHRoZSBmb2N1cyBpbmRpY2F0b3IuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfY2hpcFJpcHBsZVRhcmdldDtcbiAgICAvKipcbiAgICAgKiBSaXBwbGUgY29uZmlndXJhdGlvbiBmb3IgcmlwcGxlcyB0aGF0IGFyZSBsYXVuY2hlZCBvbiBwb2ludGVyIGRvd24uIFRoZSByaXBwbGUgY29uZmlnXG4gICAgICogaXMgc2V0IHRvIHRoZSBnbG9iYWwgcmlwcGxlIG9wdGlvbnMgc2luY2Ugd2UgZG9uJ3QgaGF2ZSBhbnkgY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yXG4gICAgICogdGhlIGNoaXAgcmlwcGxlcy5cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWcgJiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgcmlwcGxlcyBhcmUgZGlzYWJsZWQgb24gaW50ZXJhY3Rpb25cbiAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICovXG4gICAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW47XG4gICAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaGFzIGZvY3VzLiAqL1xuICAgIF9oYXNGb2N1czogYm9vbGVhbjtcbiAgICAvKiogV2hldGhlciBhbmltYXRpb25zIGZvciB0aGUgY2hpcCBhcmUgZW5hYmxlZC4gKi9cbiAgICBfYW5pbWF0aW9uc0Rpc2FibGVkOiBib29sZWFuO1xuICAgIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgaXMgc2VsZWN0YWJsZSAqL1xuICAgIGNoaXBMaXN0U2VsZWN0YWJsZTogYm9vbGVhbjtcbiAgICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGlzIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiAqL1xuICAgIF9jaGlwTGlzdE11bHRpcGxlOiBib29sZWFuO1xuICAgIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgYXMgYSB3aG9sZSBpcyBkaXNhYmxlZC4gKi9cbiAgICBfY2hpcExpc3REaXNhYmxlZDogYm9vbGVhbjtcbiAgICAvKiogVGhlIGNoaXAgYXZhdGFyICovXG4gICAgYXZhdGFyOiBNYXRDaGlwQXZhdGFyO1xuICAgIC8qKiBUaGUgY2hpcCdzIHRyYWlsaW5nIGljb24uICovXG4gICAgdHJhaWxpbmdJY29uOiBNYXRDaGlwVHJhaWxpbmdJY29uO1xuICAgIC8qKiBUaGUgY2hpcCdzIHJlbW92ZSB0b2dnbGVyLiAqL1xuICAgIHJlbW92ZUljb246IE1hdENoaXBSZW1vdmU7XG4gICAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgaXMgc2VsZWN0ZWQuICovXG4gICAgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW47XG4gICAgc2V0IHNlbGVjdGVkKHZhbHVlOiBib29sZWFuKTtcbiAgICBwcm90ZWN0ZWQgX3NlbGVjdGVkOiBib29sZWFuO1xuICAgIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGNoaXAuIERlZmF1bHRzIHRvIHRoZSBjb250ZW50IGluc2lkZSBgPG1hdC1jaGlwPmAgdGFncy4gKi9cbiAgICBnZXQgdmFsdWUoKTogYW55O1xuICAgIHNldCB2YWx1ZSh2YWx1ZTogYW55KTtcbiAgICBwcm90ZWN0ZWQgX3ZhbHVlOiBhbnk7XG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIGNoaXAgaXMgc2VsZWN0YWJsZS4gV2hlbiBhIGNoaXAgaXMgbm90IHNlbGVjdGFibGUsXG4gICAgICogY2hhbmdlcyB0byBpdHMgc2VsZWN0ZWQgc3RhdGUgYXJlIGFsd2F5cyBpZ25vcmVkLiBCeSBkZWZhdWx0IGEgY2hpcCBpc1xuICAgICAqIHNlbGVjdGFibGUsIGFuZCBpdCBiZWNvbWVzIG5vbi1zZWxlY3RhYmxlIGlmIGl0cyBwYXJlbnQgY2hpcCBsaXN0IGlzXG4gICAgICogbm90IHNlbGVjdGFibGUuXG4gICAgICovXG4gICAgZ2V0IHNlbGVjdGFibGUoKTogYm9vbGVhbjtcbiAgICBzZXQgc2VsZWN0YWJsZSh2YWx1ZTogYm9vbGVhbik7XG4gICAgcHJvdGVjdGVkIF9zZWxlY3RhYmxlOiBib29sZWFuO1xuICAgIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGlzIGRpc2FibGVkLiAqL1xuICAgIGdldCBkaXNhYmxlZCgpOiBib29sZWFuO1xuICAgIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbik7XG4gICAgcHJvdGVjdGVkIF9kaXNhYmxlZDogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBjaGlwIGRpc3BsYXlzIHRoZSByZW1vdmUgc3R5bGluZyBhbmQgZW1pdHMgKHJlbW92ZWQpIGV2ZW50cy5cbiAgICAgKi9cbiAgICBnZXQgcmVtb3ZhYmxlKCk6IGJvb2xlYW47XG4gICAgc2V0IHJlbW92YWJsZSh2YWx1ZTogYm9vbGVhbik7XG4gICAgcHJvdGVjdGVkIF9yZW1vdmFibGU6IGJvb2xlYW47XG4gICAgLyoqIEVtaXRzIHdoZW4gdGhlIGNoaXAgaXMgZm9jdXNlZC4gKi9cbiAgICByZWFkb25seSBfb25Gb2N1czogU3ViamVjdDxNYXRDaGlwRXZlbnQ+O1xuICAgIC8qKiBFbWl0cyB3aGVuIHRoZSBjaGlwIGlzIGJsdXJlZC4gKi9cbiAgICByZWFkb25seSBfb25CbHVyOiBTdWJqZWN0PE1hdENoaXBFdmVudD47XG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgY2hpcCBpcyBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuICAgIHJlYWRvbmx5IHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdENoaXBTZWxlY3Rpb25DaGFuZ2U+O1xuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoaXAgaXMgZGVzdHJveWVkLiAqL1xuICAgIHJlYWRvbmx5IGRlc3Ryb3llZDogRXZlbnRFbWl0dGVyPE1hdENoaXBFdmVudD47XG4gICAgLyoqIEVtaXR0ZWQgd2hlbiBhIGNoaXAgaXMgdG8gYmUgcmVtb3ZlZC4gKi9cbiAgICByZWFkb25seSByZW1vdmVkOiBFdmVudEVtaXR0ZXI8TWF0Q2hpcEV2ZW50PjtcbiAgICAvKiogVGhlIEFSSUEgc2VsZWN0ZWQgYXBwbGllZCB0byB0aGUgY2hpcC4gKi9cbiAgICBnZXQgYXJpYVNlbGVjdGVkKCk6IHN0cmluZyB8IG51bGw7XG4gICAgY29uc3RydWN0b3IoX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBfbmdab25lOiBOZ1pvbmUsIHBsYXRmb3JtOiBQbGF0Zm9ybSwgZ2xvYmFsUmlwcGxlT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9ucyB8IG51bGwsIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsIF9jaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmIHwgdW5kZWZpbmVkLCB0YWJJbmRleD86IHN0cmluZywgX2RvY3VtZW50PzogYW55KTtcbiAgICBfYWRkSG9zdENsYXNzTmFtZSgpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgLyoqIFNlbGVjdHMgdGhlIGNoaXAuICovXG4gICAgc2VsZWN0KCk6IHZvaWQ7XG4gICAgLyoqIERlc2VsZWN0cyB0aGUgY2hpcC4gKi9cbiAgICBkZXNlbGVjdCgpOiB2b2lkO1xuICAgIC8qKiBTZWxlY3QgdGhpcyBjaGlwIGFuZCBlbWl0IHNlbGVjdGVkIGV2ZW50ICovXG4gICAgc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTogdm9pZDtcbiAgICAvKiogVG9nZ2xlcyB0aGUgY3VycmVudCBzZWxlY3RlZCBzdGF0ZSBvZiB0aGlzIGNoaXAuICovXG4gICAgdG9nZ2xlU2VsZWN0ZWQoaXNVc2VySW5wdXQ/OiBib29sZWFuKTogYm9vbGVhbjtcbiAgICAvKiogQWxsb3dzIGZvciBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgdGhlIGNoaXAuICovXG4gICAgZm9jdXMoKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBBbGxvd3MgZm9yIHByb2dyYW1tYXRpYyByZW1vdmFsIG9mIHRoZSBjaGlwLiBDYWxsZWQgYnkgdGhlIE1hdENoaXBMaXN0IHdoZW4gdGhlIERFTEVURSBvclxuICAgICAqIEJBQ0tTUEFDRSBrZXlzIGFyZSBwcmVzc2VkLlxuICAgICAqXG4gICAgICogSW5mb3JtcyBhbnkgbGlzdGVuZXJzIG9mIHRoZSByZW1vdmFsIHJlcXVlc3QuIERvZXMgbm90IHJlbW92ZSB0aGUgY2hpcCBmcm9tIHRoZSBET00uXG4gICAgICovXG4gICAgcmVtb3ZlKCk6IHZvaWQ7XG4gICAgLyoqIEhhbmRsZXMgY2xpY2sgZXZlbnRzIG9uIHRoZSBjaGlwLiAqL1xuICAgIF9oYW5kbGVDbGljayhldmVudDogRXZlbnQpOiB2b2lkO1xuICAgIC8qKiBIYW5kbGUgY3VzdG9tIGtleSBwcmVzc2VzLiAqL1xuICAgIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZDtcbiAgICBfYmx1cigpOiB2b2lkO1xuICAgIHByaXZhdGUgX2Rpc3BhdGNoU2VsZWN0aW9uQ2hhbmdlO1xuICAgIHByaXZhdGUgX21hcmtGb3JDaGVjaztcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWQ6IEJvb2xlYW5JbnB1dDtcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0YWJsZTogQm9vbGVhbklucHV0O1xuICAgIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZW1vdmFibGU6IEJvb2xlYW5JbnB1dDtcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuLyoqXG4gKiBBcHBsaWVzIHByb3BlciAoY2xpY2spIHN1cHBvcnQgYW5kIGFkZHMgc3R5bGluZyBmb3IgdXNlIHdpdGggdGhlIE1hdGVyaWFsIERlc2lnbiBcImNhbmNlbFwiIGljb25cbiAqIGF2YWlsYWJsZSBhdCBodHRwczovL21hdGVyaWFsLmlvL2ljb25zLyNpY19jYW5jZWwuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgYDxtYXQtY2hpcD5cbiAqICAgICAgIDxtYXQtaWNvbiBtYXRDaGlwUmVtb3ZlPmNhbmNlbDwvbWF0LWljb24+XG4gKiAgICAgPC9tYXQtY2hpcD5gXG4gKlxuICogWW91ICptYXkqIHVzZSBhIGN1c3RvbSBpY29uLCBidXQgeW91IG1heSBuZWVkIHRvIG92ZXJyaWRlIHRoZSBgbWF0LWNoaXAtcmVtb3ZlYCBwb3NpdGlvbmluZ1xuICogc3R5bGVzIHRvIHByb3Blcmx5IGNlbnRlciB0aGUgaWNvbiB3aXRoaW4gdGhlIGNoaXAuXG4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1hdENoaXBSZW1vdmUge1xuICAgIHByb3RlY3RlZCBfcGFyZW50Q2hpcDogTWF0Q2hpcDtcbiAgICBjb25zdHJ1Y3RvcihfcGFyZW50Q2hpcDogTWF0Q2hpcCwgZWxlbWVudFJlZj86IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KTtcbiAgICAvKiogQ2FsbHMgdGhlIHBhcmVudCBjaGlwJ3MgcHVibGljIGByZW1vdmUoKWAgbWV0aG9kIGlmIGFwcGxpY2FibGUuICovXG4gICAgX2hhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCk6IHZvaWQ7XG59XG5leHBvcnQge307XG4iXX0=