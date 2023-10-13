// Credits go to Brecht Billiet
// Copied from: https://github.com/brechtbilliet/ngrx-undo/blob/master/src/handleUndo.ts
// Code has been modified to work with MiniRx

// MIT License
//
// Copyright (c) 2016 Brecht Billiet
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { ComponentStoreExtension, MetaReducer, StoreExtension } from '../../models';
import { ExtensionId, ExtensionSortOrder } from '../../enums';
import { createUndoMetaReducer } from './undo-meta-reducer';

const defaultBufferSize = 100;

export class UndoExtension extends StoreExtension implements ComponentStoreExtension {
    id = ExtensionId.UNDO;
    override sortOrder = ExtensionSortOrder.UNDO_EXTENSION;
    hasCsSupport = true as const;

    constructor(private config: { bufferSize: number } = { bufferSize: defaultBufferSize }) {
        super();
    }

    init(): MetaReducer<any> {
        return createUndoMetaReducer(this.config.bufferSize);
    }
}
