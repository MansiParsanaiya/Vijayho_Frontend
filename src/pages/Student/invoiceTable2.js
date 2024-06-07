export const InvoiceTable2 = ` <table style="
width: 425px !important;
height: 600px !important;
border-collapse: collapse !important;
border: 0.1px solid black !important;
font-family: 'Times New Roman', Times, serif !important;
color: black !important;
line-height: normal !important;
">
    <tr style="
  height: 52px !important;
  border-bottom: 0.1px solid black !important;
">
        <td colspan="6" align="center" style="vertical-align: top !important">
            <div style="font-size: 13px !important">{COMPANY_NAME}</div>
            <div style="font-size: 10px !important; margin-top: 3px !important">
                {COMPANY_ADDRESS}
            </div>
            <div style="font-size: 9px !important; margin-top: 3px !important">
                Mo: {COMPANY_MOBILENUMER}
            </div>
        </td>
    </tr>
    <tr style="
  height: 15px !important;
  background-color: #dfdfdf !important;
  font-weight: bold !important;
  border-bottom: 0.1px solid black !important;
  vertical-align: top !important;
" align="center">
        <td colspan="6" style="border-right: none !important">
            Customer Details
        </td>
    </tr>
    <tr style="
  height: 15px !important;
  vertical-align: top !important;
  border-bottom: 0.1px solid black !important;
">
        <td colspan="4" style="border-right: none !important">
            <div style="
      font-weight: bold !important;
      float: left !important;
      margin-right: 3px !important;
    ">
                Name:
            </div>
            {CUSTOMER_NAME}
        </td>
        <td colspan="2" style="padding-left: 15px !important; border-left: none !important" align="right">
            <div style="font-weight: bold !important">Date: {BOOKING_DATE}</div>
        </td>
    </tr>
    <tr style="
  height: 30px !important;
  vertical-align: top !important;
  border-bottom: 0.1px solid black !important;
">
        <td colspan="6">
            <div style="
      font-weight: bold !important;
      float: left !important;
      margin-right: 3px !important;
    ">
                Address:
            </div>
            {CUSTOMER_ADDRESS}
        </td>
    </tr>
    <tr style="
  height: 15px !important;
  vertical-align: top !important;
  border-bottom: 0.1px solid black !important;
">
        <td colspan="6">
            <div style="
      font-weight: bold !important;
      float: left !important;
      margin-right: 3px !important;
    ">
                Mo:
            </div>
            {CUSTOMER_MOBILENUM1}
        </td>
    </tr>
    <tr style="
  height: 15px !important;
  background-color: #dfdfdf !important;
  font-weight: bold !important;
  border-bottom: 0.1px solid black !important;
">
        <td style="
    width: 12px !important;
    border-right: 0.1px solid black !important;
  " align="center">
            No
        </td>
        <td style="
    width: 52px !important;
    border-right: 0.1px solid black !important;
  " colspan="2">
            Date
        </td>
        <!-- <td style="border-right: 0.1px solid black !important">Name</td> -->
        <td style="
    width: 40px !important;
    border-right: 0.1px solid black !important;
  " colspan="2">
            Course Name
        </td>
        <!-- <td style="
    width: 40px !important;
    border-right: 0.1px solid black !important;
  ">
                Return
            </td> -->
        <td style="width: 50px !important;text-align: end;">Amount</td>
    </tr>

    {INSTALLMENTS}

      <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>  <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    <tr style="height: 20px !important;">
        <td style="border-right: 0.1px solid black !important" align="center">

        </td>
        <td style="border-right: 0.1px solid black !important" colspan="2"></td>
        <!-- <td style="border-right: 0.1px solid black !important">{PRODUCT_NAME}</td> -->
        <td style="border-right: 0.1px solid black !important" colspan="2"> <br> <span
                style="font-size: 6px;font-weight: 100; font-family: NotoSansGujarati-Regular !important;"></span>
        </td>

        <td style="float: right;">
            <div style="float: left; font-family: NotoSansGujarati-Regular !important;"> </div>
        </td>
    </tr>
    
    




    <tr style="
  height: 15px !important;
  border-top: 0.1px solid black !important;
">
        <td rowspan="4" colspan="3" style="
    border-right: 0.1px solid black !important;
    border-bottom: 0.1px solid black !important;
    vertical-align: top !important;
  ">
            
        </td>
        <td style="
    font-weight: bold !important;
    border-right: 0.1px solid black !important;
    border-bottom: 0.1px solid black !important;
  " colspan="2">
            Total Amount
        </td>
        <td style="
    font-weight: bold !important;
    border-bottom: 0.1px solid black !important;
  text-align: end;">
            <span style="font-family: NotoSansGujarati-Regular !important;">₹</span> {TOTALRENT}
        </td>
    </tr>
    <tr style="height: 15px !important; font-weight: bold !important">
        <td colspan="2" style="
    border-right: 0.1px solid black !important;
    border-bottom: 0.1px solid black !important;
  ">
            Discount
        </td>
        <td style="border-bottom: 0.1px solid black !important; text-align: end;">
            <span style="font-family: NotoSansGujarati-Regular !important; ">₹</span> {DISCOUNT}
        </td>
    </tr>
    <tr style="height: 15px !important; font-weight: bold !important">
        <td colspan="2" style="
    border-right: 0.1px solid black !important;
    border-bottom: 0.1px solid black !important;
  ">
            Total Fees
        </td>
        <td style="border-bottom: 0.1px solid black !important; text-align: end;">
            <span style="font-family: NotoSansGujarati-Regular !important; ">₹</span> {ADVANCE}
        </td>
    </tr>
    <tr style="height: 15px !important; font-weight: bold !important">
        <td colspan="2" style="
    border-right: 0.1px solid black !important;
    border-bottom: 0.1px solid black !important;
  ">
            Remaining Fees
        </td>
        <td style="border-bottom: 0.1px solid black !important; text-align: end;">
            <span style="font-family: NotoSansGujarati-Regular !important;">₹</span> {PAYBLE_AMOUNT}
        </td>
    </tr>
    <!-- <tr style="height: 15px !important; font-weight: bold !important"> -->
    <!-- <td colspan="2" style="
    border-right: 0.1px solid black !important;
    border-bottom: 0.1px solid black !important;
  ">
                Deposit
            </td> -->
    <!-- <td style="border-bottom: 0.1px solid black !important">
                <div style="float: left; font-family: NotoSansGujarati-Regular !important;"></div>
            </td> -->
    <!-- </tr> -->
    <tr>
        <td colspan="6" style="vertical-align: top !important">
            <div>
            
            </div>
            <div>
                
            </div>
            <div>
               
            </div>
            <div>
                
            </div>
        </td>
    </tr>
</table>`