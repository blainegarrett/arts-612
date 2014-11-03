# Event module constants

EVENT_KIND = 'Event'

EVENT_SEARCH_INDEX = 'events_index'


class CATEGORY(object):
    """
    Event Date Category
    """
    RECEPTION = 'reception' # Art Opening, Closing, etc, etc
    ONGOING = 'ongoing' # Designation for on display, etc - non-event - can be wide range

    HOURS = 'hours' # Special category for search. Business Hours, etc - concise range - connected with ongoing possibly


class EVENT_DATE_TYPE(object):
    """
    Event Date Types
    """
    TIMED = 'timed'
    REOCURRING = 'reoccurring'