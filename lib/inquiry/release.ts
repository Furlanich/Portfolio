export type InquiryReleaseRecord = { readonly mode: 'demonstration' | 'commercial'; readonly releaseId: string };

export const INQUIRY_RELEASE: InquiryReleaseRecord = {
  mode: 'demonstration',
  releaseId: 'DEMONSTRATION',
};
