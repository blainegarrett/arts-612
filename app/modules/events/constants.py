# Event module constants

EVENT_KIND = 'Event'

EVENT_SEARCH_INDEX = 'events_index'

# Temp cache keys
UPCOMING_CACHE_KEY = 'upcoming_rest_cache'
NOWSHOWING_CACHE_KEY = 'nowshowing_rest_cache'

QUERY_LIMIT = 25

class CATEGORY(object):
    """
    Event Date Category
    """
    RECEPTION = 'reception' # Art Opening, Closing, etc, etc
    ONGOING = 'ongoing' # Designation for on display, etc - non-event - can be wide range
    SALE = 'sale'
    PERFORMANCE = 'performance' # Has a specific time, but can't just show up whenever...
    HOURS = 'hours' # Special category for search. Business Hours, etc - concise range - connected with ongoing possibly


class EVENT_DATE_TYPE(object):
    """
    Event Date Types
    """
    TIMED = 'timed'
    REOCURRING = 'reoccurring'