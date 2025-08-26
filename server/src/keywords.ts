export const simpleKeywords = [
  'true',
  'false',
  'env',
  'if',
  'else',
  'try',
  'catch',
  'finally',
  'throw',
  'echo',
  'always',
  'changed',
  'fixed',
  'regression',
  'aborted',
  'failure',
  'success',
  'unstable',
  'unsuccessful',
  'cleanup',
  'step',
  'matrix',
  'parallel',
];

export const keywords: {
  [name: string]: { required: string; parameters: string; allowed: string };
} = {
  agent: {
    required: 'Yes',
    parameters: 'any|none|label||node|docker|dockerfile',
    allowed: 'In the top-level pipeline block and each stage block.',
  },
  post: {
    required: 'No',
    parameters: 'None',
    allowed: 'In the top-level pipeline block and each stage block.',
  },
  stages: {
    required: 'Yes',
    parameters: 'None',
    allowed: 'Only once, inside the pipeline block.',
  },
  steps: {
    required: 'Yes',
    parameters: 'None',
    allowed: 'Inside each stage block.',
  },
  environment: {
    required: 'No',
    parameters: 'None',
    allowed: 'Inside the pipeline block, or within stage directives.',
  },
  options: {
    required: 'No',
    parameters: 'None',
    allowed: 'Only once, inside the pipeline block.',
  },
  parameters: {
    required: 'No',
    parameters: 'None',
    allowed: 'Only once, inside the pipeline block.',
  },
  triggers: {
    required: 'No',
    parameters: 'None',
    allowed: 'Only once, inside the pipeline block.',
  },
  stage: {
    required: 'At least one',
    parameters: 'One mandatory parameter, a string for the name of the stage.',
    allowed: 'Inside the stages section.',
  },
  tools: {
    required: 'No',
    parameters: 'None',
    allowed: 'Inside the pipeline block or a stage block.',
  },
  when: {
    required: 'No',
    parameters: 'None',
    allowed: 'Inside a stage directive',
  },
};
