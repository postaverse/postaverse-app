import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StyleSheet } from 'react-native';

export interface DialogAction {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface DialogOptions {
  title: string;
  message?: string;
  actions?: DialogAction[];
  type?: 'alert' | 'confirm';
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  showAlert: (title: string, message?: string, onPress?: () => void) => void;
  showConfirm: (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
    confirmStyle?: 'default' | 'destructive'
  ) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogState {
  visible: boolean;
  title: string;
  message?: string;
  actions: DialogAction[];
  type: 'alert' | 'confirm';
}

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: '',
    message: '',
    actions: [],
    type: 'alert',
  });

  const showDialog = (options: DialogOptions) => {
    const defaultActions: DialogAction[] = options.actions || [
      { text: 'OK', style: 'default', onPress: hideDialog }
    ];

    setDialog({
      visible: true,
      title: options.title,
      message: options.message,
      actions: defaultActions,
      type: options.type || 'alert',
    });
  };

  const showAlert = (title: string, message?: string, onPress?: () => void) => {
    showDialog({
      title,
      message,
      type: 'alert',
      actions: [
        {
          text: 'OK',
          style: 'default',
          onPress: () => {
            hideDialog();
            onPress?.();
          }
        }
      ]
    });
  };

  const showConfirm = (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel',
    confirmStyle: 'default' | 'destructive' = 'default'
  ) => {
    showDialog({
      title,
      message,
      type: 'confirm',
      actions: [
        {
          text: cancelText,
          style: 'cancel',
          onPress: () => {
            hideDialog();
            onCancel?.();
          }
        },
        {
          text: confirmText,
          style: confirmStyle,
          onPress: () => {
            hideDialog();
            onConfirm?.();
          }
        }
      ]
    });
  };

  const hideDialog = () => {
    setDialog(prev => ({ ...prev, visible: false }));
  };

  const handleActionPress = (action: DialogAction) => {
    if (action.onPress) {
      action.onPress();
    } else {
      hideDialog();
    }
  };

  return (
    <DialogContext.Provider value={{ showDialog, showAlert, showConfirm, hideDialog }}>
      {children}
      
      {/* Universal Dialog Component */}
      <UniversalDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        actions={dialog.actions}
        onActionPress={handleActionPress}
      />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

// Universal Dialog Component
interface UniversalDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: DialogAction[];
  onActionPress: (action: DialogAction) => void;
}

const UniversalDialog: React.FC<UniversalDialogProps> = ({
  visible,
  title,
  message,
  actions,
  onActionPress,
}) => {
  const [
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
  ] = [
    require('react-native').Modal,
    require('react-native').View,
    require('react-native').Text,
    require('react-native').TouchableOpacity,
    require('react-native').StyleSheet,
    require('react-native').TouchableWithoutFeedback,
  ];

  const { Ionicons } = require('@expo/vector-icons');

  const getIconForAction = (action: DialogAction) => {
    switch (action.style) {
      case 'destructive':
        return 'warning';
      case 'cancel':
        return 'close-circle';
      default:
        return 'checkmark-circle';
    }
  };

  const getIconColor = (action: DialogAction) => {
    switch (action.style) {
      case 'destructive':
        return '#ef4444';
      case 'cancel':
        return '#9ca3af';
      default:
        return '#38bdf8';
    }
  };

  const hasDestructiveAction = actions.some(action => action.style === 'destructive');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onActionPress({ text: 'Cancel', style: 'cancel' })}
    >
      <TouchableWithoutFeedback onPress={() => onActionPress({ text: 'Cancel', style: 'cancel' })}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              {/* Header with icon */}
              <View style={styles.header}>
                <View style={[
                  styles.iconContainer,
                  hasDestructiveAction && styles.destructiveIconContainer
                ]}>
                  <Ionicons 
                    name={hasDestructiveAction ? 'warning' : 'information-circle'} 
                    size={28} 
                    color={hasDestructiveAction ? '#ef4444' : '#38bdf8'} 
                  />
                </View>
                <Text style={styles.title}>{title}</Text>
              </View>

              {/* Message */}
              {message && (
                <Text style={styles.message}>{message}</Text>
              )}

              {/* Actions */}
              <View style={[
                styles.actions,
                actions.length === 1 && styles.singleAction,
                actions.length > 2 && styles.stackedActions
              ]}>
                {actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.actionButton,
                      action.style === 'cancel' && styles.cancelButton,
                      action.style === 'destructive' && styles.destructiveButton,
                      actions.length === 1 && styles.singleActionButton,
                      actions.length > 2 && styles.stackedActionButton
                    ]}
                    onPress={() => onActionPress(action)}
                  >
                    <Text style={[
                      styles.actionText,
                      action.style === 'cancel' && styles.cancelText,
                      action.style === 'destructive' && styles.destructiveText,
                      action.style === 'default' && styles.defaultText
                    ]}>
                      {action.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  destructiveIconContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
  },
  message: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  singleAction: {
    flexDirection: 'column',
  },
  stackedActions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf8',
  },
  singleActionButton: {
    flex: 0,
  },
  stackedActionButton: {
    flex: 0,
  },
  cancelButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  destructiveButton: {
    backgroundColor: '#ef4444',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelText: {
    color: '#d1d5db',
  },
  destructiveText: {
    color: '#ffffff',
  },
  defaultText: {
    color: '#ffffff',
  },
});
