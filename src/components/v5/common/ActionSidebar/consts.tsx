import { type Variants } from 'framer-motion';
import { object, string } from 'yup';

// Do not import these from `./hooks` to avoid circular dependencies

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { stripHTMLFromText } from '~utils/elements.ts';
import { formatText } from '~utils/intl.ts';

import { permissionsValidationSchema } from './hooks/usePermissionsValidation.ts';
import { reputationValidationSchema } from './hooks/useReputationValidation.ts';

export const ACTION_TYPE_FIELD_NAME = 'actionType';
export const DECISION_METHOD_FIELD_NAME = 'decisionMethod';

export const actionSidebarAnimation: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
  },
};

function isValidDescriptionLength(description: string) {
  const strippedDescription = stripHTMLFromText(description);
  return strippedDescription.length <= MAX_ANNOTATION_LENGTH;
}

export const ACTION_BASE_VALIDATION_SCHEMA = object()
  .shape({
    title: string()
      .required(formatText({ id: 'errors.title.required' }))
      .max(60, ({ max }) =>
        formatText(
          { id: 'errors.title.maxLength' },
          {
            maxLength: max,
          },
        ),
      ),
    description: string()
      .test(
        'isValidDescriptionLength',
        ({ value }) =>
          formatText(
            { id: 'errors.title.maxLength' },
            {
              maxLength: MAX_ANNOTATION_LENGTH,
              currentLength:
                value !== undefined ? stripHTMLFromText(value).length : 0,
            },
          ),
        isValidDescriptionLength,
      )
      .notRequired(),
  })
  .defined()
  .concat(reputationValidationSchema)
  .concat(permissionsValidationSchema);
