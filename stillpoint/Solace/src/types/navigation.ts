export type RootStackParamList = {
  Home: undefined;
  FocusIntention: undefined;
  WorkSession: { intentionWord: string | undefined };
  WorkRestTransition: undefined;
  RestSession: { restMode: string };
  CycleComplete: undefined;
  ReturnPrompt: undefined;
  LongBreak: undefined;
  Settings: undefined;
};
