/**
 * Purchase hook stub.
 * In production, this would integrate with RevenueCat (react-native-purchases).
 * For now, provides a no-op interface.
 */
export function usePurchase() {
  const init = async () => {
    // Purchases.configure(...)
  };

  const getOfferings = async () => {
    return [];
  };

  const purchase = async (_pkgId: string) => {
    // In production: Purchases.purchasePackage(pkg)
    return null;
  };

  const restorePurchases = async () => {
    // In production: Purchases.restorePurchases()
    return null;
  };

  const checkEntitlement = async (_entitlementId: string): Promise<boolean> => {
    return false;
  };

  return { init, getOfferings, purchase, restorePurchases, checkEntitlement };
}
