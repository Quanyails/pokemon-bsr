//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

class FindStatsHandler implements ActionListener {
    BaseStatsRatings applet;

    public FindStatsHandler(BaseStatsRatings var1) {
        this.applet = var1;
    }

    private boolean isNumber(String var1) {
        boolean var2 = !var1.equals("");

        for(int var3 = 0; var3 < var1.length(); ++var3) {
            var2 = var2 && Character.isDigit(var1.charAt(var3));
        }

        return var2;
    }

    private double SpeedFactor(int var1) {
        if (var1 < 6) {
            return 0.0D;
        } else if (var1 < 11) {
            return 2.0D;
        } else if (var1 < 16) {
            return 4.0D;
        } else if (var1 < 21) {
            return 11.0D;
        } else if (var1 < 24) {
            return 19.0D;
        } else if (var1 < 26) {
            return 22.0D;
        } else if (var1 < 29) {
            return 30.0D;
        } else if (var1 < 31) {
            return 31.0D;
        } else if (var1 == 31) {
            return 54.0D;
        } else if (var1 == 32) {
            return 56.0D;
        } else if (var1 == 33) {
            return 58.0D;
        } else if (var1 == 34) {
            return 60.0D;
        } else if (var1 == 35) {
            return 61.0D;
        } else if (var1 == 36) {
            return 79.0D;
        } else if (var1 < 40) {
            return 84.0D;
        } else if (var1 == 40) {
            return 85.0D;
        } else if (var1 == 41) {
            return 111.0D;
        } else if (var1 == 42) {
            return 113.0D;
        } else if (var1 == 43) {
            return 115.0D;
        } else if (var1 < 46) {
            return 118.0D;
        } else if (var1 == 46) {
            return 139.0D;
        } else if (var1 == 47) {
            return 140.0D;
        } else if (var1 == 48) {
            return 141.0D;
        } else if (var1 < 51) {
            return 144.0D;
        } else if (var1 == 51) {
            return 179.0D;
        } else if (var1 == 52) {
            return 181.0D;
        } else if (var1 < 56) {
            return 183.0D;
        } else if (var1 == 56) {
            return 203.0D;
        } else if (var1 < 59) {
            return 206.0D;
        } else if (var1 < 61) {
            return 210.0D;
        } else if (var1 == 61) {
            return 239.0D;
        } else if (var1 < 64) {
            return 241.0D;
        } else if (var1 < 66) {
            return 242.0D;
        } else if (var1 == 66) {
            return 268.0D;
        } else if (var1 == 67) {
            return 270.0D;
        } else if (var1 == 68) {
            return 273.0D;
        } else if (var1 < 71) {
            return 275.0D;
        } else if (var1 == 71) {
            return 305.0D;
        } else if (var1 == 72) {
            return 308.0D;
        } else if (var1 < 75) {
            return 309.0D;
        } else if (var1 == 75) {
            return 310.0D;
        } else if (var1 == 76) {
            return 318.0D;
        } else if (var1 == 77) {
            return 320.0D;
        } else if (var1 == 78) {
            return 321.0D;
        } else if (var1 < 81) {
            return 323.0D;
        } else if (var1 == 81) {
            return 348.0D;
        } else if (var1 == 82) {
            return 351.0D;
        } else if (var1 == 83) {
            return 352.0D;
        } else if (var1 == 84) {
            return 354.0D;
        } else if (var1 == 85) {
            return 355.0D;
        } else if (var1 == 86) {
            return 381.0D;
        } else if (var1 == 87) {
            return 386.0D;
        } else if (var1 < 91) {
            return 387.0D;
        } else if (var1 == 91) {
            return 411.0D;
        } else if (var1 < 94) {
            return 416.0D;
        } else if (var1 < 96) {
            return 417.0D;
        } else if (var1 < 98) {
            return 438.0D;
        } else if (var1 < 101) {
            return 440.0D;
        } else if (var1 < 103) {
            return 463.0D;
        } else if (var1 < 106) {
            return 464.0D;
        } else if (var1 < 109) {
            return 471.0D;
        } else if (var1 < 111) {
            return 472.0D;
        } else if (var1 < 113) {
            return 480.0D;
        } else if (var1 < 116) {
            return 481.0D;
        } else if (var1 < 121) {
            return 488.0D;
        } else if (var1 < 126) {
            return 492.0D;
        } else if (var1 < 128) {
            return 495.0D;
        } else if (var1 < 131) {
            return 496.0D;
        } else if (var1 < 141) {
            return 500.0D;
        } else if (var1 < 151) {
            return 501.0D;
        } else if (var1 < 161) {
            return 503.0D;
        } else {
            return var1 < 181 ? 504.0D : 505.0D;
        }
    }

    private String rating(double var1) {
        int var3 = (int)Math.round(var1) / 25;
        String var4 = " Rank " + Integer.toString(var3);
        switch(var3) {
            case 1:
                var4 = var4 + ": Bad";
                break;
            case 2:
                var4 = var4 + ": Poor";
                break;
            case 3:
                var4 = var4 + ": Below Average";
                break;
            case 4:
                var4 = var4 + ": Above Average";
                break;
            case 5:
                var4 = var4 + ": Good";
                break;
            case 6:
                var4 = var4 + ": Very Good";
                break;
            case 7:
                var4 = var4 + ": Excellent";
                break;
            case 8:
                var4 = var4 + ": Fantastic";
                break;
            default:
                if (var3 < 1) {
                    var4 = var4 + ": Horrible";
                } else {
                    var4 = var4 + ": Amazing";
                }
        }

        return var4;
    }

    private String ODBRating(double var1) {
        if (var1 > 20.0D) {
            return " Absolutely biased towards Offense";
        } else if (var1 > 15.0D) {
            return " Heavily biased towards Offense";
        } else if (var1 > 10.0D) {
            return " Biased towards Offense";
        } else if (var1 > 5.0D) {
            return " Moderately biased towards Offense";
        } else if (var1 > 0.0D) {
            return " Slightly biased towards Offense";
        } else if (var1 > -5.0D) {
            return " Slightly biased towards Defense";
        } else if (var1 > -10.0D) {
            return " Moderately biased towards Defense";
        } else if (var1 > -15.0D) {
            return " Biased towards Defense";
        } else {
            return var1 > -20.0D ? " Heavily biased towards Defense" : " Absolutely biased towards Defense";
        }
    }

    private String PSBRating(double var1) {
        if (var1 > 20.0D) {
            return " Absolutely biased towards Physical";
        } else if (var1 > 15.0D) {
            return " Heavily biased towards Physical";
        } else if (var1 > 10.0D) {
            return " Biased towards Physical";
        } else if (var1 > 5.0D) {
            return " Moderately biased towards Physical";
        } else if (var1 > 0.0D) {
            return " Slightly biased towards Physical";
        } else if (var1 > -5.0D) {
            return " Slightly biased towards Special";
        } else if (var1 > -10.0D) {
            return " Moderately biased towards Special";
        } else if (var1 > -15.0D) {
            return " Biased towards Special";
        } else {
            return var1 > -20.0D ? " Heavily biased towards Special" : " Absolutely biased towards Special";
        }
    }

    private String ORRating(double var1) {
        int var3 = (int)Math.round(var1) / 50;
        String var4 = " Rank " + Integer.toString(var3);
        switch(var3) {
            case 1:
                var4 = var4 + ": Bad";
                break;
            case 2:
                var4 = var4 + ": Poor";
                break;
            case 3:
                var4 = var4 + ": Below Average";
                break;
            case 4:
                var4 = var4 + ": Above Average";
                break;
            case 5:
                var4 = var4 + ": Good";
                break;
            case 6:
                var4 = var4 + ": Very Good";
                break;
            case 7:
                var4 = var4 + ": Excellent";
                break;
            case 8:
                var4 = var4 + ": Fantastic";
                break;
            default:
                if (var3 < 1) {
                    var4 = var4 + ": Horrible";
                } else {
                    var4 = var4 + ": Amazing";
                }
        }

        return var4;
    }

    public void actionPerformed(ActionEvent var1) {
        String var2 = this.applet.HP_TF.getText();
        if (!this.isNumber(var2)) {
            this.applet.ErrorLabel.setText("Base HP is not a number!");
            this.applet.setHP(0);
            this.applet.HP_TF.setText("");
        } else {
            this.applet.setHP(Integer.parseInt(var2));
            if (this.applet.getHP() <= 255 && this.applet.getHP() >= 0) {
                var2 = this.applet.Atk_TF.getText();
                if (!this.isNumber(var2)) {
                    this.applet.ErrorLabel.setText("Base Atk is not a number!");
                    this.applet.setAtk(0);
                    this.applet.Atk_TF.setText("");
                } else {
                    this.applet.setAtk(Integer.parseInt(var2));
                    if (this.applet.getAtk() <= 255 && this.applet.getAtk() >= 0) {
                        var2 = this.applet.Def_TF.getText();
                        if (!this.isNumber(var2)) {
                            this.applet.ErrorLabel.setText("Base Def is not a number!");
                            this.applet.setDef(0);
                            this.applet.Def_TF.setText("");
                        } else {
                            this.applet.setDef(Integer.parseInt(var2));
                            if (this.applet.getDef() <= 255 && this.applet.getDef() >= 0) {
                                var2 = this.applet.SpA_TF.getText();
                                if (!this.isNumber(var2)) {
                                    this.applet.ErrorLabel.setText("Base SpA is not a number!");
                                    this.applet.setSpA(0);
                                    this.applet.SpA_TF.setText("");
                                } else {
                                    this.applet.setSpA(Integer.parseInt(var2));
                                    if (this.applet.getSpA() <= 255 && this.applet.getSpA() >= 0) {
                                        var2 = this.applet.SpD_TF.getText();
                                        if (!this.isNumber(var2)) {
                                            this.applet.ErrorLabel.setText("Base SpD is not a number!");
                                            this.applet.setSpD(0);
                                            this.applet.SpD_TF.setText("");
                                        } else {
                                            this.applet.setSpD(Integer.parseInt(var2));
                                            if (this.applet.getSpD() <= 255 && this.applet.getSpD() >= 0) {
                                                var2 = this.applet.Spe_TF.getText();
                                                if (!this.isNumber(var2)) {
                                                    this.applet.ErrorLabel.setText("Base Spe is not a number!");
                                                    this.applet.setSpe(0);
                                                    this.applet.Spe_TF.setText("");
                                                } else {
                                                    this.applet.setSpe(Integer.parseInt(var2));
                                                    if (this.applet.getSpe() <= 255 && this.applet.getSpe() >= 0) {
                                                        this.applet.ErrorLabel.setText("Base Stats Ratings of Pokemon Version 2.0 -- by X-Act");
                                                        double eHP = (double)this.applet.getHP() * 2.0D + 141.0D;
                                                        double eAtk = (double)this.applet.getAtk() * 2.0D + 36.0D;
                                                        double eDef = (double)this.applet.getDef() * 2.0D + 36.0D;
                                                        double eSpa = (double)this.applet.getSpA() * 2.0D + 36.0D;
                                                        double eSpD = (double)this.applet.getSpD() * 2.0D + 36.0D;
                                                        double eSpe = this.SpeedFactor(this.applet.getSpe()) / 505.0D;
                                                        double pt = eHP * eDef / 417.5187D - 18.9256D;
                                                        double st = eHP * eSpD / 434.8833D - 13.9044D;
                                                        double ps = eAtk * (eAtk * eSpe + 415.0D) / (1.855522D * (eAtk * (1.0D - eSpe) + 415.0D)) - 4.36533D;
                                                        double ss = eSpa * (eSpa * eSpe + 415.0D) / (1.947004D * (eSpa * (1.0D - eSpe) + 415.0D)) + 4.36062D;
                                                        double odb = (Math.max(ps, ss) - Math.max(pt, st)) / 6.243721D - 0.326255D;
                                                        double psb = (pt - st + (ps - ss)) / 6.840256D;
                                                        double rating = (pt + st + ps + ss) / 1.525794D - 62.1586D;
                                                        this.applet.PSLabel.setText(Integer.toString((int)Math.round(ps)));
                                                        this.applet.PTLabel.setText(Integer.toString((int)Math.round(pt)));
                                                        this.applet.SSLabel.setText(Integer.toString((int)Math.round(ss)));
                                                        this.applet.STLabel.setText(Integer.toString((int)Math.round(st)));
                                                        this.applet.ODBLabel.setText(Double.toString((double)Math.round(odb * 100.0D) / 100.0D));
                                                        this.applet.PSBLabel.setText(Double.toString((double)Math.round(psb * 100.0D) / 100.0D));
                                                        this.applet.ORLabel.setText(Integer.toString((int)Math.round(rating)));
                                                        this.applet.PSComment.setText(this.rating(ps));
                                                        this.applet.PTComment.setText(this.rating(pt));
                                                        this.applet.SSComment.setText(this.rating(ss));
                                                        this.applet.STComment.setText(this.rating(st));
                                                        this.applet.ODBComment.setText(this.ODBRating(odb));
                                                        this.applet.PSBComment.setText(this.PSBRating(psb));
                                                        this.applet.ORComment.setText(this.ORRating(rating));
                                                    } else {
                                                        this.applet.ErrorLabel.setText("Base Spe must be between 0 and 255!");
                                                        this.applet.setSpe(0);
                                                        this.applet.Spe_TF.setText("");
                                                    }
                                                }
                                            } else {
                                                this.applet.ErrorLabel.setText("Base SpD must be between 0 and 255!");
                                                this.applet.setSpD(0);
                                                this.applet.SpD_TF.setText("");
                                            }
                                        }
                                    } else {
                                        this.applet.ErrorLabel.setText("Base SpA must be between 0 and 255!");
                                        this.applet.setSpA(0);
                                        this.applet.SpA_TF.setText("");
                                    }
                                }
                            } else {
                                this.applet.ErrorLabel.setText("Base Def must be between 0 and 255!");
                                this.applet.setDef(0);
                                this.applet.Def_TF.setText("");
                            }
                        }
                    } else {
                        this.applet.ErrorLabel.setText("Base Atk must be between 0 and 255!");
                        this.applet.setAtk(0);
                        this.applet.Atk_TF.setText("");
                    }
                }
            } else {
                this.applet.ErrorLabel.setText("Base HP must be between 0 and 255!");
                this.applet.setHP(0);
                this.applet.HP_TF.setText("");
            }
        }
    }
}
