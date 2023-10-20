export const enum ExtensionSortOrder {
    DEFAULT = 0,
    // The Undo Extension Meta Reducer should be the last one to be executed before "normal" reducers (for performance)
    // Reason: The Undo Extension Meta Reducers may send many Actions through all following Reducers to undo an Action
    // Also, we want to prevent that the replay of Actions shows up e.g. in the LoggerExtension Meta Reducer
    UNDO_EXTENSION = 1,
}

export const enum ExtensionId {
    IMMUTABLE_STATE,
    UNDO,
    LOGGER,
    REDUX_DEVTOOLS,
}
