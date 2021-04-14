output=output
echo=off



SRCS= $(wildcard *.sol) 
ifneq ($(fs), )
	SRCS = $(fs)
endif

SRCS_OBJS = $(patsubst %.sol, %_output, $(SRCS)) 

all: main

main: select clean build 

build: $(SRCS_OBJS)

define show_title
    @echo -n "--------------------------------------------------------"
	@echo -n $(1)
    @echo "--------------------------------------------------------"
endef

$(SRCS_OBJS):%_output : %.sol

	$(call show_title, $<)
	@solc --optimize --overwrite --abi --bin -o $(output)/$@ $<
	@echo "output-->:"
	@ls $(output)/$@ 

select:
    ifneq ($(v), )
		@solc-select use $(v)
    endif

clean:
	@echo "clean ${output}"
	@rm -rf $(output)/*

.PHONY: clean select build 
