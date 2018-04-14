// TODO: should we care strings pass for say IntegerField, FloatField, etc...?

import Form from './form';
import TextField from './fields/text-field';
import FormsField from './fields/forms-field';
import FormField from './fields/form-field';
import ListField from './fields/list-field';

const createForm = () => {
  const nameForm = new Form({
    fields: [
      new TextField({
        name: 'firstName',
        label: 'First Name',
        required: true,
        maxLength: 10
      }),
      new TextField({
        name: 'lastName',
        label: 'Last Name',
        required: true
      })
    ]
  });

  const emailForm = new Form({
    fields: [
      new TextField({
        name: 'email',
        label: 'Email',
        required: true
      })
    ]
  });

  const form = new Form({
    fields: [
      new FormField({
        name: 'fullName',
        label: 'Full Name',
        required: true,
        form: nameForm
      }),

      new TextField({
        name: 'title',
        label: 'Title',
        maxLength: 10
      }),

      new FormsField({
        name: 'emails',
        label: 'Emails',
        form: emailForm,
        required: true,
        maxSize: 2
      }),

      new ListField({
        name: 'phoneNumbers',
        label: 'Phone Numbers',
        required: true,
        field: new TextField({
          name: 'phone',
          label: 'Phone',
          required: true,
          maxLength: 14
        }),
        maxSize: 2
      })
    ]
  });

  return form;
};

it('should set and get nested values', () => {
  const form = createForm();

  form.setValues({
    fullName: {
      firstName: 'Ella',
      lastName: 'Fitzgerald'
    },
    title: 'Founder',
    emails: [
      {
        email: 'ella1@example.com'
      },
      {
        email: 'ella2@example.com'
      }
    ],
    phoneNumbers: ['(206) 111-1111', '(206) 222-2222']
  });

  expect(form.getValues()).toEqual({
    id: null,
    fullName: {
      id: null,
      firstName: 'Ella',
      lastName: 'Fitzgerald'
    },
    title: 'Founder',
    emails: [
      {
        id: null,
        email: 'ella1@example.com'
      },
      {
        id: null,
        email: 'ella2@example.com'
      }
    ],
    phoneNumbers: ['(206) 111-1111', '(206) 222-2222']
  });

  form
    .getField('emails')
    .getForm(0)
    .setValues({ email: 'ella3@example.com' });

  form.getField('fullName').setValues({ lastName: 'Fitz' });

  form
    .getField('phoneNumbers')
    .getField(0)
    .setValue('(206) 333-3333');

  expect(form.getValues()).toEqual({
    id: null,
    fullName: {
      id: null,
      firstName: 'Ella',
      lastName: 'Fitz'
    },
    title: 'Founder',
    emails: [
      {
        id: null,
        email: 'ella3@example.com'
      },
      {
        id: null,
        email: 'ella2@example.com'
      }
    ],
    phoneNumbers: ['(206) 333-3333', '(206) 222-2222']
  });
});

it('should validate nested values', () => {
  const form = createForm();

  // No errors
  form.setValues({
    fullName: {
      firstName: 'Ella',
      lastName: 'Fitzgerald'
    },
    title: 'Founder',
    emails: [
      {
        id: '1',
        email: 'ella1@example.com'
      },
      {
        id: '2',
        email: 'ella2@example.com'
      }
    ],
    phoneNumbers: ['(206) 111-1111', '(206) 222-2222']
  });
  form.validate();
  expect(form.hasErr()).toBe(false);

  // Test errors in nested forms
  form.setValues({
    fullName: {
      firstName: null,
      lastName: 'Fitzgerald'
    },
    title: 'Founder of Things',
    emails: [
      {
        id: '1',
        email: 'ella1@example.com'
      },
      {
        id: '2',
        email: 'ella2@example.com'
      },
      {
        id: '3',
        email: 'ella3@example.com'
      },
      {
        id: '4',
        email: null
      }
    ],
    phoneNumbers: ['(206) 111-1111 x123', '(206) 222-2222']
  });
  form.validate();
  expect(form.hasErr()).toBe(true);

  const errs = form.getErrs();

  // Missing firstName
  expect(errs[0]).toEqual({
    field: 'fullName',
    error: [
      {
        field: 'firstName',
        error: 'required'
      }
    ]
  });

  // Title too long
  expect(errs[1]).toEqual({
    field: 'title',
    error: '10 characters or less'
  });

  // Too many emails
  // Email cannot be null
  expect(errs[2]).toEqual({
    field: 'emails',
    error: [
      {
        id: '4',
        error: [
          {
            field: 'email',
            error: 'required'
          }
        ]
      },
      {
        error: '2 or less'
      }
    ]
  });

  // Phone number is too long
  expect(errs[3]).toEqual({
    field: 'phoneNumbers',
    error: [
      {
        field: 0,
        error: '14 characters or less'
      }
    ]
  });
});

it('should require nested values', () => {
  const form = createForm();

  // Missing required fields
  form.setValues({
    title: 'Founder'
  });
  form.validate();
  expect(form.hasErr()).toBe(true);

  const errs = form.getErrs();

  // Missing fullName
  expect(errs[0]).toEqual({
    field: 'fullName',
    error: 'required'
  });

  // Missing emails
  expect(errs[1]).toEqual({
    field: 'emails',
    error: 'required'
  });

  // Missing phone numbers
  expect(errs[2]).toEqual({
    field: 'phoneNumbers',
    error: 'required'
  });

  // Set required states of 1st layer of fields to false and test
  form.getField('fullName').set({ required: false });
  form
    .getField('fullName')
    .getForm()
    .setRequired(false);
  form.getField('emails').set({ required: false });
  form.getField('phoneNumbers').set({ required: false });
  form.setValues({
    title: 'Founder'
  });
  form.validate();
  expect(form.hasErr()).toBe(false);
});

it('should validate nested form validators', () => {
  const form = createForm();

  form
    .getField('fullName')
    .getForm()
    .set({
      validators: [
        {
          selector: {
            firstName: {
              value: 'F. Scott'
            }
          },
          error: {
            field: 'firstName',
            error: 'cannot be {{firstName.value}}'
          }
        }
      ]
    });

  form
    .getField('emails')
    .get('form')
    .set({
      validators: [
        {
          selector: {
            email: {
              value: 'scott@example.com'
            }
          },
          error: {
            field: 'email',
            error: 'cannot be {{email.value}}'
          }
        }
      ]
    });

  // No errors
  form.setValues({
    fullName: {
      firstName: 'Ella',
      lastName: 'Fitzgerald'
    },
    title: 'Founder',
    emails: [
      {
        id: '1',
        email: 'ella1@example.com'
      }
    ],
    phoneNumbers: ['(206) 111-1111']
  });
  form.validate();
  expect(form.hasErr()).toBe(false);

  // Trigger nested validator errors
  form.setValues({
    fullName: {
      firstName: 'F. Scott',
      lastName: 'Fitzgerald'
    },
    title: 'Founder',
    emails: [
      {
        id: '1',
        email: 'scott@example.com'
      }
    ],
    phoneNumbers: ['(206) 111-1111']
  });
  form.validate();
  expect(form.hasErr()).toBe(true);

  const errs = form.getErrs();

  // firstName error
  expect(errs[0]).toEqual({
    field: 'fullName',
    error: [
      {
        field: 'firstName',
        error: 'cannot be F. Scott'
      }
    ]
  });

  // email error
  expect(errs[1]).toEqual({
    field: 'emails',
    error: [
      {
        id: '1',
        error: [
          {
            field: 'email',
            error: 'cannot be scott@example.com'
          }
        ]
      }
    ]
  });
});

// TODO: should report bad types

// TODO: should report extra fields
