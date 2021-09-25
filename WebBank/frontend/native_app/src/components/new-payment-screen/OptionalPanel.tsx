import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, Modal, TextInput } from 'react-native'

import { styles } from "components/new-payment-screen/newPaymentStyle";
import editLogo from "assets/edit.png";
import { NewPayment } from 'modules/interfaces/newPayment';
import nextLogo from "assets/next.png";
import backLogo from "assets/back.png";
import NewPaymentContainer from "components/new-payment-screen/newPaymentContainer";

type InputName = "variableSymbol" | "constantSymbol" | "specificSymbol" | "";

interface OptionalPanelProps {
    newPayment: NewPayment,
    handleChange: (inputName: InputName, value: string, length: number) => void,
}

const OptionalPanel: React.FC<OptionalPanelProps> = (props) => {


    // Název parametru
    const [ inputName, setInputName ] = useState<InputName>("");


    // Text záhlaví
    const [ headerText, setHeaderText ] = useState<string>("");


    // Zobrazení / skrytí Modalu
    const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);

    
    /**
     * Zobrazení Modalu
     * 
     * @param inputName - název vstupn [ variableSymbol, constantSymbol, specificSymbol ]
     */
    const handleModal = (inputName: InputName): void => {
        
        setIsModalVisible(true);
        setInputName(inputName);
        
        switch (inputName) {
            
            case "variableSymbol": setHeaderText("Variabilní symbol"); break;
            
            case "constantSymbol": setHeaderText("Konstantní symbol"); break;
            
            case "specificSymbol": setHeaderText("Specifický symbol"); break;
        }
    }
    

    const { newPayment, handleChange } = props;
    const isValueEmpty: boolean = (newPayment[inputName] as string === "" ? true : false);


    /**
     * Vykreslení
     */
    return (
        <View style={styles.optionalConatiner}>

            {/* Modal */}
            <Modal visible={isModalVisible} animationType={"slide"} statusBarTranslucent={true}>
                
                <NewPaymentContainer headerText={headerText} label="Nepovinný údaj" >

                    <View style={styles.inputContainer}>

                        <TextInput
                            style={styles.input}
                            placeholder={headerText} 
                            value={newPayment[inputName] as string}
                            onChangeText={(value) => 
                                handleChange(inputName, value, (inputName === "constantSymbol" ? 4 : 10))} />

                    </View>

                    {/* Navigační tlačítka */}
                    <View style={[{flexDirection: "row"}, {justifyContent: (isValueEmpty ? "flex-end" : "space-between")}]}>

                        {/* Smazat */}
                        <TouchableOpacity 
                            style={[styles.buttonContainer, {display: (isValueEmpty ? "none" : "flex")}]} 
                            onPress={() => {
                                handleChange(inputName, "", (inputName === "constantSymbol" ? 4 : 10));
                                setIsModalVisible(false);
                            }}>

                            <Image style={styles.navigationLogo} source={backLogo} />
                            <Text style={styles.navigationText}>Smazat</Text>      
                        </TouchableOpacity>

                        {/* Dokončit */}
                        <TouchableOpacity 
                            style={styles.buttonContainer} 
                            activeOpacity={0.7} 
                            onPress={() => setIsModalVisible(false)}>
                            
                            <Text style={styles.navigationText}>Dokončit</Text>
                            <Image style={styles.navigationLogo} source={nextLogo} />
                        </TouchableOpacity>
                    </View>
                    
                </NewPaymentContainer>
            </Modal>

            {/* Variabilní symbol */}
            <View style={styles.optionalRow}>
                <TouchableOpacity 
                    style={styles.optionalButton}
                    activeOpacity={0.5} 
                    onPress={() => handleModal("variableSymbol")}>

                    <Image style={styles.editLogo} source={editLogo} />
                </TouchableOpacity>

                <View>
                    <Text style={styles.previewLabel}>Variabilní symbol: </Text>
                    <Text style={styles.previewText}>{newPayment.variableSymbol}</Text>
                </View>
            </View>

            {/* Konstantní symbol */}
            <View style={styles.optionalRow}>
                <TouchableOpacity 
                    style={styles.optionalButton}
                    activeOpacity={0.5} 
                    onPress={() => handleModal("constantSymbol")} >

                    <Image style={styles.editLogo} source={editLogo} />
                </TouchableOpacity>
                
                <View>
                    <Text style={styles.previewLabel}>Konstantní symbol: </Text>
                    <Text style={styles.previewText}>{newPayment.constantSymbol}</Text>
                </View>
            </View>

            {/* Specifický symbol */}
            <View style={styles.optionalRow}>
                <TouchableOpacity 
                    style={styles.optionalButton}
                    activeOpacity={0.5} 
                    onPress={() => handleModal("specificSymbol")} >

                    <Image style={styles.editLogo} source={editLogo} />
                </TouchableOpacity>

                <View>
                    <Text style={styles.previewLabel}>Specifický symbol: </Text>
                    <Text style={styles.previewText}>{newPayment.specificSymbol}</Text>
                </View>
            </View>
        </View>
    )
}

export default OptionalPanel
