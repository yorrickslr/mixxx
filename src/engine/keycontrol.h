#ifndef KEYCONTROL_H
#define KEYCONTROL_H

#include "engine/enginecontrol.h"
#include "tapfilter.h"

class ControlObject;
class ControlPotmeter;
class ControlPushButton;

class KeyControl : public EngineControl {
    Q_OBJECT
  public:
    KeyControl(QString group, ConfigObject<ConfigValue>* pConfig);
    virtual ~KeyControl();

    void resetPitchToLinear();

    // Returns a value describing the pitch ratio. A pitch adjustment of 1.0
    // means no change should take place.
    double getPitchRatio() const;

    double getKey();

    void collectFeatures(GroupFeatureState* pGroupFeatures) const;

  private slots:
    void slotSetEngineKey(double);
    void slotFileKeyChanged(double);
    void slotPitchChanged(double);
    void slotRateChanged();
    void slotSyncKey(double);

  private:
    bool syncKey(EngineBuffer* pOtherEngineBuffer);
    void updateKeyCOs(double fileKeyNumeric, double pitch);

    // The previous rate slider rate.
    double m_dOldRate;
    bool m_bOldKeylock;
    double m_dPitchCompensation;
    double m_dPitchCompensationOldPitch;

    double m_speedSliderPitchRatio;

    // ControlObjects that come from EngineBuffer
    ControlObject* m_pRateSlider;
    ControlObject* m_pRateRange;
    ControlObject* m_pRateDir;
    ControlObject* m_pKeylock;
    ControlPotmeter* m_pPitchAdjust;
    ControlPotmeter* m_pPitch;
    ControlPushButton* m_pButtonSyncKey;

    /** The current loaded file's detected key */
    ControlObject* m_pFileKey;

    /** The current effective key of the engine */
    ControlObject* m_pEngineKey;
    ControlPotmeter* m_pEngineKeyDistance;

    TrackPointer m_pTrack;

    // this is the calculated value used by engine buffer for pitch
    // by default is is equal to the tempoRatio set by the speed slider
    double m_pitchRatio;
};

#endif // KEYCONTROL_H
