import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        data = {
            'success': False,
            'message': 'Something went wrong',
            'errors': response.data if isinstance(response.data, dict) else {'detail': response.data},
        }
        response.data = data
    else:
        logger.error(f"Unhandled exception: {str(exc)}")
        response = Response(
            {
                'success': False,
                'message': 'Internal server error',
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
