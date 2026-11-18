interface ImageA11yProps {
  role?: 'img';
  'aria-label'?: string;
  'aria-hidden'?: true;
}

export function imageA11yProps(label?: string): ImageA11yProps {
  return label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
}
