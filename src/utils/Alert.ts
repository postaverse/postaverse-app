import { useDialog } from '../contexts/DialogContext';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

/**
 * Universal Alert replacement that works across all platforms
 * Provides the same API as React Native's Alert for easy migration
 */
export const useAlert = () => {
  const { showAlert, showConfirm } = useDialog();

  const alert = (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { cancelable?: boolean }
  ) => {
    // If no buttons provided, show simple alert
    if (!buttons || buttons.length === 0) {
      showAlert(title, message);
      return;
    }

    // If only one button, show simple alert
    if (buttons.length === 1) {
      const button = buttons[0];
      showAlert(title, message, button.onPress);
      return;
    }

    // If two buttons, treat as confirmation dialog
    if (buttons.length === 2) {
      const cancelButton = buttons.find(b => b.style === 'cancel') || buttons[0];
      const confirmButton = buttons.find(b => b.style !== 'cancel') || buttons[1];
      
      showConfirm(
        title,
        message,
        confirmButton.onPress,
        cancelButton.onPress,
        confirmButton.text,
        cancelButton.text,
        confirmButton.style === 'destructive' ? 'destructive' : 'default'
      );
      return;
    }

    // For more than 2 buttons, use the full dialog system
    const { showDialog } = useDialog();
    showDialog({
      title,
      message,
      actions: buttons.map(button => ({
        text: button.text,
        style: button.style || 'default',
        onPress: button.onPress
      }))
    });
  };

  return { alert };
};

/**
 * Static Alert replacement object that mimics React Native's Alert API
 * Can be used as a drop-in replacement: Alert.alert() -> UniversalAlert.alert()
 */
export class UniversalAlert {
  private static dialogContext: any = null;

  static setDialogContext(context: any) {
    this.dialogContext = context;
  }

  static alert(
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { cancelable?: boolean }
  ) {
    if (!this.dialogContext) {
      console.warn('UniversalAlert: Dialog context not set. Make sure to wrap your app with DialogProvider.');
      return;
    }

    const { showAlert, showConfirm, showDialog } = this.dialogContext;

    // If no buttons provided, show simple alert
    if (!buttons || buttons.length === 0) {
      showAlert(title, message);
      return;
    }

    // If only one button, show simple alert
    if (buttons.length === 1) {
      const button = buttons[0];
      showAlert(title, message, button.onPress);
      return;
    }

    // If two buttons, treat as confirmation dialog
    if (buttons.length === 2) {
      const cancelButton = buttons.find(b => b.style === 'cancel') || buttons[0];
      const confirmButton = buttons.find(b => b.style !== 'cancel') || buttons[1];
      
      showConfirm(
        title,
        message,
        confirmButton.onPress,
        cancelButton.onPress,
        confirmButton.text,
        cancelButton.text,
        confirmButton.style === 'destructive' ? 'destructive' : 'default'
      );
      return;
    }

    // For more than 2 buttons, use the full dialog system
    showDialog({
      title,
      message,
      actions: buttons.map(button => ({
        text: button.text,
        style: button.style || 'default',
        onPress: button.onPress
      }))
    });
  }
}
